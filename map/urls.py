from django.urls import path

from .views import Index, MapWindow, AjaxResponse

app_name = 'map'
urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('window/', MapWindow.as_view(), name='window'),
    path('window/ajax/', AjaxResponse.as_view(), name='ajax'),
]
