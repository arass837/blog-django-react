"""Django settings for the ReactoDjango project.

One codebase is used in both environments:
- local development (VS Code): local PostgreSQL and React on localhost
- production (Render): Neon via DATABASE_URL and React Static Site

Production secrets are supplied by Render environment variables. Local secrets live in
backend/.env.local (ignored by Git).
"""

import os
from pathlib import Path
from datetime import timedelta

import dj_database_url
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured


BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default=None):
    value = os.getenv(name)
    if not value:
        return list(default or [])
    return [item.strip() for item in value.split(",") if item.strip()]


# Render automatically exposes RENDER=true. ENVIRONMENT is kept as an optional
# explicit override so the same repository also works on other hosts.
ON_RENDER = env_bool("RENDER", False)
ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "production" if ON_RENDER else "local",
).strip().lower()
IS_PRODUCTION = ON_RENDER or ENVIRONMENT == "production"

# Local variables are loaded only on the developer machine. Render values come
# directly from the service Environment page and are never stored in the repo.
if not IS_PRODUCTION:
    load_dotenv(BASE_DIR / ".env.local", override=False)

# Security
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if IS_PRODUCTION:
        raise ImproperlyConfigured("SECRET_KEY must be set in production.")
    SECRET_KEY = "django-insecure-local-development-only"

DEBUG = env_bool("DEBUG", default=not IS_PRODUCTION)

if IS_PRODUCTION:
    default_hosts = [".onrender.com"]
    render_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME", "").strip()
    if render_hostname:
        default_hosts.append(render_hostname)
else:
    default_hosts = ["127.0.0.1", "localhost", "[::1]"]

configured_hosts = env_list("ALLOWED_HOSTS", [])
ALLOWED_HOSTS = list(dict.fromkeys(default_hosts + configured_hosts))


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
    "blog",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# CORS / CSRF
# Local React works automatically. In production set CORS_ALLOWED_ORIGINS on
# Render to the Static Site URL. FRONTEND_URL is also accepted for convenience.
if IS_PRODUCTION:
    default_cors = []
else:
    default_cors = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

cors_origins = env_list("CORS_ALLOWED_ORIGINS", default_cors)
frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if frontend_url and frontend_url not in cors_origins:
    cors_origins.append(frontend_url)
CORS_ALLOWED_ORIGINS = cors_origins

csrf_origins = env_list("CSRF_TRUSTED_ORIGINS", [])
for origin in CORS_ALLOWED_ORIGINS:
    if origin.startswith(("http://", "https://")) and origin not in csrf_origins:
        csrf_origins.append(origin)
CSRF_TRUSTED_ORIGINS = csrf_origins


# Database
# Render/Neon: DATABASE_URL is set in Render.
# Local VS Code: if DATABASE_URL is absent, the local PostgreSQL database below
# is used. Values can be changed in backend/.env.local.
database_url = os.getenv("DATABASE_URL", "").strip()
if database_url:
    DATABASES = {
        "default": dj_database_url.parse(
            database_url,
            conn_max_age=60 if IS_PRODUCTION else 0,
            ssl_require=IS_PRODUCTION,
        )
    }
    if IS_PRODUCTION:
        DATABASES["default"]["CONN_HEALTH_CHECKS"] = True
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "oski"),
            "USER": os.getenv("DB_USER", "postgres"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Django/admin static files. React is deployed independently as a Render Static Site.
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

if IS_PRODUCTION:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
