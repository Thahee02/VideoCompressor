"""
Django settings for backend project — Video Compressor (in-memory, no DB).
Secrets are loaded from backend/.env via python-decouple.
"""

from pathlib import Path
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-videocompressor-dev-key-change-in-production')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

INSTALLED_APPS = [
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'compressor',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# No database — all in memory
DATABASES = {}

# No password validators needed
AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

# CORS — allow Vite dev server (configure via .env)
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173',
    cast=Csv(),
)
CORS_ALLOW_ALL_ORIGINS = DEBUG  # allow all in dev, restrict in prod

# Max upload size (from .env, default 2 GB)
_max_upload = config('MAX_UPLOAD_SIZE', default=2 * 1024 * 1024 * 1024, cast=int)
DATA_UPLOAD_MAX_MEMORY_SIZE = _max_upload
FILE_UPLOAD_MAX_MEMORY_SIZE = _max_upload

# DRF settings — no auth needed (in-memory only app)
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.JSONParser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [],   # no auth
    'DEFAULT_PERMISSION_CLASSES': [],       # no permissions
    'UNAUTHENTICATED_USER': None,           # don't import AnonymousUser
}
