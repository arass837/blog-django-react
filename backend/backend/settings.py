
# # PRODUKCJA******************************************************************************************************** 
# import os
# from pathlib import Path
# from datetime import timedelta
# import dj_database_url
# from dotenv import load_dotenv

# # Wczytaj .env lokalnie lub w Render
# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent

# # 🔐 SECURITY
# SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
# DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# # ALLOWED_HOSTS z ENV
# # ALLOWED_HOSTS = os.environ.get(
# #     'ALLOWED_HOSTS', 'localhost,127.0.0.1'
# # ).split(',')

# ALLOWED_HOSTS = ['127.0.0.1', 'localhost', '[::1]']

# # 📦 APPS
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',

#     'rest_framework',
#     'corsheaders',
#     'blog',
#     'rest_framework_simplejwt',
# ]

# # ⚙️ MIDDLEWARE
# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',  # serwowanie statycznych plików
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'backend.urls'

# # 🌐 CORS
# CORS_ALLOWED_ORIGINS = os.environ.get(
#     'CORS_ALLOWED_ORIGINS',
#     'http://localhost:3000,http://localhost:5173'
# ).split(',')

# # 🔑 DRF + JWT
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
# }

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
# }

# # 📄 TEMPLATES (React build)
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [os.path.join(BASE_DIR, '../frontend/build')],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'backend.wsgi.application'

# # 🗄️ DATABASE (Render PostgreSQL)
# DATABASES = {
#     'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
# }

# # 🔒 PASSWORDS
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# # 🌍 INTERNATIONALIZATION
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # 📁 STATIC FILES (React build)
# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATICFILES_DIRS = [os.path.join(BASE_DIR, '../frontend/build/static')]
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# # 🧠 DEFAULT PK
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ================================================================================================
# import os
# from pathlib import Path
# from datetime import timedelta
# import dj_database_url
# from dotenv import load_dotenv

# # Wczytaj zmienne środowiskowe z .env
# load_dotenv()

# BASE_DIR = Path(__file__).resolve().parent.parent

# # 🔐 SECURITY
# SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')

# # 🔧 DEBUG
# DEBUG = os.environ.get('DEBUG', 'True') == 'True'  # Domyślnie True lokalnie

# # ALLOWED_HOSTS – uniwersalne
# ALLOWED_HOSTS = os.environ.get(
#     "ALLOWED_HOSTS",
#     "127.0.0.1,localhost,[::1]"
# ).split(",")
# ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS if host.strip()]
# # 📦 APLIKACJE
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',

#     'rest_framework',
#     'corsheaders',
#     'blog',
#     'rest_framework_simplejwt',
# ]

# # ⚙️ MIDDLEWARE
# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',  # statyczne pliki
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'corsheaders.middleware.CorsMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'backend.urls'

# CORS_ALLOWED_ORIGINS = os.environ.get(
#     "CORS_ALLOWED_ORIGINS",
#     "http://localhost:3000,http://localhost:5173"
# ).split(",")
# CORS_ALLOWED_ORIGINS = [url.strip() for url in CORS_ALLOWED_ORIGINS if url.strip()]

# # 🔑 DRF + JWT
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
# }

# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
# }

# # 📄 TEMPLATES (React build)
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [os.path.join(BASE_DIR, '../frontend/build')],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'backend.wsgi.application'

# # 🗄️ DATABASE
# DATABASES = {
#     'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
# }

# # 🔒 PASSWORD VALIDATORS
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# # 🌍 INTERNATIONALIZATION
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # 📁 STATIC FILES (React build)
# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATICFILES_DIRS = [os.path.join(BASE_DIR, '../frontend/build/static')]
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# # 🧠 DEFAULT PK
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ==============================================================================================
import os
from pathlib import Path
from datetime import timedelta
import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# 🔹 Wybór środowiska
# ENVIRONMENT=local / production
ENVIRONMENT = os.environ.get("ENVIRONMENT", "local")

# 🔹 Wczytanie odpowiedniego pliku .env
if ENVIRONMENT == "local":
    load_dotenv(BASE_DIR / ".env.local")
else:
    load_dotenv(BASE_DIR / ".env.production")

# 🔐 SECURITY
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
DEBUG = os.environ.get("DEBUG", "False") == "True"

# ALLOWED_HOSTS dynamicznie
if ENVIRONMENT == "local":
    ALLOWED_HOSTS = ["127.0.0.1", "localhost", "[::1]"]
else:
    ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

# 📦 APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
    'blog',
    'rest_framework_simplejwt',
]

# ⚙️ MIDDLEWARE
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# 🌐 CORS
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

# 🔑 DRF + JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# 📄 TEMPLATES (React build)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, '../frontend/build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# 🗄️ DATABASE
DATABASES = {
    'default': dj_database_url.config(default=os.environ.get("DATABASE_URL"))
}

# 🔒 PASSWORDS
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 🌍 INTERNATIONALIZATION
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# 📁 STATIC FILES (React build)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, '../frontend/build/static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# 🧠 DEFAULT PK
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'