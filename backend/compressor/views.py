"""
API views for the video compressor.

Endpoints:
  POST   /api/upload/          — Accept video upload, start compression
  GET    /api/status/<job_id>/ — Poll compression progress
  GET    /api/download/<job_id>/ — Download compressed video (then free memory)
  DELETE /api/cancel/<job_id>/  — Cancel job and free memory
"""

import os
from django.http import StreamingHttpResponse, JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status

from . import job_store
from .compressor import start_compression, PRESETS

ALLOWED_EXTENSIONS = {".mp4", ".mkv", ".mov", ".avi", ".webm", ".flv", ".wmv", ".m4v"}
MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024  # 2 GB


@api_view(["POST"])
@parser_classes([MultiPartParser])
def upload_video(request):
    """Accept a video file + preset and kick off compression."""
    video_file = request.FILES.get("video")
    if not video_file:
        return Response({"error": "No video file provided."}, status=status.HTTP_400_BAD_REQUEST)

    ext = os.path.splitext(video_file.name)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return Response(
            {"error": f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if video_file.size > MAX_FILE_SIZE:
        return Response({"error": "File too large. Maximum size is 2 GB."}, status=status.HTTP_400_BAD_REQUEST)

    preset = request.data.get("preset", "balanced")
    if preset not in PRESETS:
        preset = "balanced"

    # Read entire file into memory
    input_data = video_file.read()

    # Create job in memory
    job_id = job_store.create_job(
        preset=preset,
        original_name=video_file.name,
        input_data=input_data,
    )

    # Start background compression thread
    start_compression(job_id)

    return Response({
        "job_id": job_id,
        "original_name": video_file.name,
        "original_size": len(input_data),
        "preset": preset,
        "preset_description": PRESETS[preset]["description"],
    }, status=status.HTTP_202_ACCEPTED)


@api_view(["GET"])
def job_status(request, job_id):
    """Return current status and progress of a compression job."""
    job = job_store.get_job(job_id)
    if not job:
        return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "original_size": job["original_size"],
        "compressed_size": job["compressed_size"],
        "original_name": job["original_name"],
        "preset": job["preset"],
        "error": job.get("error"),
    })


@api_view(["GET"])
def download_video(request, job_id):
    """Stream the compressed video to the client, then delete it from memory."""
    job = job_store.get_job(job_id)
    if not job:
        return JsonResponse({"error": "Job not found."}, status=404)

    if job["status"] != "done":
        return JsonResponse({"error": f"Job is not ready. Current status: {job['status']}"}, status=400)

    output_bytes = job_store.get_output_bytes(job_id)
    if not output_bytes:
        return JsonResponse({"error": "Compressed data not available."}, status=404)

    original_name = job.get("original_name", "video.mp4")
    base_name = os.path.splitext(original_name)[0]
    download_name = f"{base_name}_compressed.mp4"

    def file_iterator(data, chunk_size=8192):
        for i in range(0, len(data), chunk_size):
            yield data[i : i + chunk_size]
        # Free memory after streaming completes
        job_store.delete_job(job_id)

    response = StreamingHttpResponse(
        file_iterator(output_bytes),
        content_type="video/mp4",
    )
    response["Content-Disposition"] = f'attachment; filename="{download_name}"'
    response["Content-Length"] = len(output_bytes)
    response["Access-Control-Expose-Headers"] = "Content-Disposition, Content-Length"
    return response


@api_view(["DELETE"])
def cancel_job(request, job_id):
    """Cancel a running job and free all memory immediately."""
    job = job_store.get_job(job_id)
    if not job:
        return Response({"message": "Job not found or already removed."}, status=status.HTTP_200_OK)

    job_store.cancel_job(job_id)
    job_store.delete_job(job_id)

    return Response({"message": "Job cancelled and memory freed."}, status=status.HTTP_200_OK)
