from pathlib import Path

import environ
from django.contrib.messages import constants as messages

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_NAME = Path(BASE_DIR).name

# .envファイル読み込み
env = environ.Env()
env.read_env(str(Path(BASE_DIR).joinpath('.env')))

DEBUG = False

SECRET_KEY = env('SECRET_KEY')

GOOGLE_MAPS_API_KEY = env('GOOGLE_MAPS_API_KEY')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

MESSAGE_TAGS = {
    messages.DEBUG: 'dark',
    messages.ERROR: 'danger',
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'map.apps.MapConfig',
    'leaflet',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LOGIN_URL = 'map:login'
LOGOUT_URL = 'map:logout'
LOGIN_REDIRECT_URL = 'map:window'
LOGOUT_REDIRECT_URL = 'map:login'

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [Path(BASE_DIR).joinpath('templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Postgis settings
DATABASES = {
   'default': env.db()
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ja'

TIME_ZONE = 'Asia/Tokyo'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Static files settings
STATIC_URL = '/static/'
STATIC_ROOT = f'/var/www/{PROJECT_NAME}/static'

MEDIA_URL = '/media/'
MEDIA_ROOT = f'/var/www/{PROJECT_NAME}/media'
