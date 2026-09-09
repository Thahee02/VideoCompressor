"""
FFmpeg-based video compression engine.
Uses imageio-ffmpeg bundled binary — no system FFmpeg install needed.
Reads from in-memory bytes, compresses via temp files, stores result back in memory.
Runs in a background thread — never blocks the Django request cycle.
"""

import os
import re
import subprocess
import tempfile
import threading
import time

from . import job_store

# Preset configurations
PRESETS = {
    "balanced": {
        "vcodec": "libx264",
        "crf": "23",
        "preset": "fast",
        "acodec": "aac",
        "audio_bitrate": "128k",
        "description": "H.264 · CRF 23 · Best balance of size & quality",
    },
    "high_compression": {
        "vcodec": "libx265",
        "crf": "28",
        "preset": "fast",
        "acodec": "aac",
        "audio_bitrate": "96k",
        "description": "H.265 · CRF 28 · Maximum compression",
    },
    "lossless": {
        "vcodec": "libx264",
        "crf": "18",
        "preset": "medium",
        "acodec": "aac",
        "audio_bitrate": "192k",
        "description": "H.264 · CRF 18 · Near-lossless quality",
    },
}


def _get_ffmpeg_exe() -> str:
    """Return path to bundled FFmpeg binary via imageio-ffmpeg."""
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as e:
        raise RuntimeError(
            "FFmpeg not found. Run: pip install imageio-ffmpeg"
        ) from e


def _probe_duration(ffmpeg_exe: str, input_path: str) -> float:
    """Extract video duration in seconds by probing input file using ffmpeg -i."""
    try:
        cmd = [ffmpeg_exe, "-i", input_path]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=10,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        # Duration is printed to stderr by ffmpeg -i
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", result.stderr)
        if match:
            h = float(match.group(1))
            m = float(match.group(2))
            s = float(match.group(3))
            tot = h * 3600 + m * 60 + s
            return tot
    except Exception:
        pass
    return 0.0


def _compress(job_id: str):
    """Core compression worker — runs in a background thread."""
    input_tmp = None
    output_tmp = None
    process = None

    try:
        job_store.update_job(job_id, status="processing", progress=1)

        job_info = job_store.get_job(job_id)
        if not job_info or job_store.is_cancelled(job_id):
            return

        ffmpeg_exe = _get_ffmpeg_exe()

        # Pull input bytes from memory
        with job_store._lock:
            input_data = job_store._jobs[job_id].get("input_bytes")
        if not input_data:
            job_store.update_job(job_id, status="failed", error="Input data missing")
            return

        preset_name = job_info.get("preset", "balanced")
        preset = PRESETS.get(preset_name, PRESETS["balanced"])
        original_name = job_info.get("original_name", "video.mp4")
        ext = os.path.splitext(original_name)[-1].lower() or ".mp4"

        # Write input to a temp file
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as f:
            f.write(input_data)
            input_tmp = f.name

        # Free input bytes from RAM immediately
        with job_store._lock:
            if job_id in job_store._jobs:
                job_store._jobs[job_id]["input_bytes"] = None

        if job_store.is_cancelled(job_id):
            return

        # Probe video duration for progress %
        duration = _probe_duration(ffmpeg_exe, input_tmp)

        # Prepare output temp file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
            output_tmp = f.name

        # Build FFmpeg command
        cmd = [
            ffmpeg_exe,
            "-y",
            "-i", input_tmp,
            "-vcodec", preset["vcodec"],
            "-crf", preset["crf"],
            "-preset", preset["preset"],
            "-acodec", preset["acodec"],
            "-b:a", preset["audio_bitrate"],
            "-movflags", "+faststart",
            "-progress", "pipe:1",
            "-nostats",
            "-loglevel", "error",
            output_tmp,
        ]

        if preset["vcodec"] == "libx265":
            cmd.insert(-1, "-tag:v")
            cmd.insert(-1, "hvc1")

        creation_flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0

        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            creationflags=creation_flags,
        )

        stderr_lines = []
        def drain_stderr():
            try:
                for line in process.stderr:
                    stderr_lines.append(line)
            except Exception:
                pass

        stderr_thread = threading.Thread(target=drain_stderr, daemon=True)
        stderr_thread.start()

        # RegEx patterns for parsing FFmpeg -progress output
        re_us = re.compile(r"out_time_us=(\d+)")
        re_ms = re.compile(r"out_time_ms=(\d+)")
        re_time = re.compile(r"out_time=(\d+):(\d+):(\d+(?:\.\d+)?)")

        start_time = time.time()
        last_pct = 1

        while True:
            line = process.stdout.readline()
            if not line:
                break
            if job_store.is_cancelled(job_id):
                process.kill()
                return

            current_s = 0.0
            matched = False

            # Check out_time_us (microseconds)
            m_us = re_us.search(line)
            if m_us:
                val = int(m_us.group(1))
                if val > 0:
                    current_s = val / 1_000_000
                    matched = True

            # Check out_time_ms (can be microseconds or milliseconds)
            if not matched:
                m_ms = re_ms.search(line)
                if m_ms:
                    val = int(m_ms.group(1))
                    if val > 0:
                        current_s = val / 1_000_000 if val > 10000 else val / 1000
                        matched = True

            # Check out_time=HH:MM:SS.ss
            if not matched:
                m_t = re_time.search(line)
                if m_t:
                    h = float(m_t.group(1))
                    m = float(m_t.group(2))
                    s = float(m_t.group(3))
                    current_s = h * 3600 + m * 60 + s
                    matched = True

            if duration > 0 and current_s > 0:
                pct = min(int((current_s / duration) * 100), 99)
                if pct > last_pct:
                    last_pct = pct
                    job_store.update_job(job_id, progress=pct)
            elif duration == 0:
                # Fallback estimation if duration couldn't be probed
                elapsed = time.time() - start_time
                est_pct = min(int(elapsed * 10), 95)
                if est_pct > last_pct:
                    last_pct = est_pct
                    job_store.update_job(job_id, progress=est_pct)

        process.wait()
        stderr_thread.join(timeout=3)

        if job_store.is_cancelled(job_id):
            return

        if process.returncode != 0:
            err_text = "".join(stderr_lines)[-400:]
            job_store.update_job(
                job_id,
                status="failed",
                error=f"FFmpeg error (code {process.returncode}): {err_text}",
            )
            return

        # Read compressed output into memory
        with open(output_tmp, "rb") as f:
            output_data = f.read()

        with job_store._lock:
            if job_id in job_store._jobs:
                job_store._jobs[job_id]["output_bytes"] = output_data

        job_store.update_job(
            job_id,
            status="done",
            progress=100,
            compressed_size=len(output_data),
        )

    except Exception as e:
        job_store.update_job(job_id, status="failed", error=str(e))

    finally:
        if process and process.poll() is None:
            try:
                process.kill()
            except Exception:
                pass
        for tmp in [input_tmp, output_tmp]:
            if tmp and os.path.exists(tmp):
                try:
                    os.unlink(tmp)
                except Exception:
                    pass


def start_compression(job_id: str):
    """Spawn a daemon thread to compress the video for the given job_id."""
    t = threading.Thread(target=_compress, args=(job_id,), daemon=True)
    t.start()
    return t
