from django.urls import path

from .views import Index, MapWindow

app_name = 'map'
urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('window/', MapWindow.as_view(), name='window'),
]
