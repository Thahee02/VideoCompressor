from django.urls import path
from . import views

urlpatterns = [
    path("upload/", views.upload_video, name="upload_video"),
    path("status/<str:job_id>/", views.job_status, name="job_status"),
    path("download/<str:job_id>/", views.download_video, name="download_video"),
    path("cancel/<str:job_id>/", views.cancel_job, name="cancel_job"),
]
