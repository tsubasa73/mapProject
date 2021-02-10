from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_NAME = Path(BASE_DIR).name


SECRET_KEY = '(lgdu#0@z-8xc21fn_@9k39=8ye$yqxg951=s-c6k2)rv-!qk9'


DEBUG = True


ALLOWED_HOSTS = []


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
   'default': {
       'ENGINE': 'django.contrib.gis.db.backends.postgis',
       'NAME': 'map_db',
       'USER': 'map_admin',
       'HOST': 'localhost',
       'PASSWORD': 'map_admin',
   }
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


# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [Path(BASE_DIR).joinpath('static')]
STATIC_ROOT = Path(BASE_DIR).joinpath('static_root')
# STATIC_ROOT = f'/var/www/{PROJECT_NAME}/static'

MEDIA_URL = '/media/'
MEDIA_ROOT = f'/var/www/{PROJECT_NAME}/media'


# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# # debug toolbar
# if DEBUG:
#     def show_toolbar(request):
#         return True
#
#     INSTALLED_APPS += (
#         'debug_toolbar',
#     )
#     MIDDLEWARE += (
#         'debug_toolbar.middleware.DebugToolbarMiddleware',
#     )
#     DEBUG_TOOLBAR_CONFIG = {
#         'SHOW_TOOLBAR_CALLBACK': show_toolbar,
#     }
