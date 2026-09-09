"""
In-memory job store for video compression jobs.
Thread-safe dictionary. No database. No file system.
Jobs are automatically purged after 30 minutes.
"""

import threading
import uuid
from datetime import datetime, timezone, timedelta
from io import BytesIO

# Global job registry — lives in server RAM
_jobs: dict = {}
_lock = threading.Lock()

JOB_TTL_MINUTES = 30


def create_job(preset: str, original_name: str, input_data: bytes) -> str:
    """Create a new compression job and return its ID."""
    job_id = str(uuid.uuid4())
    with _lock:
        _jobs[job_id] = {
            "status": "pending",        # pending | processing | done | failed
            "progress": 0,              # 0–100
            "preset": preset,
            "original_name": original_name,
            "original_size": len(input_data),
            "compressed_size": None,
            "input_bytes": input_data,  # raw bytes
            "output_bytes": None,       # compressed bytes (set when done)
            "error": None,
            "created_at": datetime.now(timezone.utc),
            "cancelled": False,
        }
    return job_id


def get_job(job_id: str) -> dict | None:
    """Return a shallow copy of the job dict (without heavy bytes fields)."""
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            return None
        return {k: v for k, v in job.items() if k not in ("input_bytes", "output_bytes")}


def get_output_bytes(job_id: str) -> bytes | None:
    """Return the compressed output bytes."""
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            return None
        return job.get("output_bytes")


def update_job(job_id: str, **kwargs):
    """Update specific fields of a job."""
    with _lock:
        if job_id in _jobs:
            _jobs[job_id].update(kwargs)


def is_cancelled(job_id: str) -> bool:
    """Check if a job has been cancelled."""
    with _lock:
        job = _jobs.get(job_id)
        return job.get("cancelled", False) if job else True


def cancel_job(job_id: str):
    """Mark job as cancelled and delete it from memory."""
    with _lock:
        if job_id in _jobs:
            _jobs[job_id]["cancelled"] = True
            _jobs[job_id]["status"] = "cancelled"


def delete_job(job_id: str):
    """Remove job and free all associated memory."""
    with _lock:
        _jobs.pop(job_id, None)


def purge_old_jobs():
    """Remove jobs older than JOB_TTL_MINUTES. Called by background thread."""
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=JOB_TTL_MINUTES)
    with _lock:
        expired = [
            jid for jid, job in _jobs.items()
            if job["created_at"] < cutoff
        ]
        for jid in expired:
            del _jobs[jid]


def _start_purge_loop():
    """Background thread that purges expired jobs every 5 minutes."""
    import time
    while True:
        time.sleep(300)
        purge_old_jobs()


# Start the purge thread when this module is imported
_purge_thread = threading.Thread(target=_start_purge_loop, daemon=True)
_purge_thread.start()
