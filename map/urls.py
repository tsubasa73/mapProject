from django.urls import path

from .views import MapIndex, MapWindow, MapAjax, MapInput, MapComplete, MapDetail

app_name = 'map'
urlpatterns = [
    path('', MapIndex.as_view(), name='index'),
    path('window/', MapWindow.as_view(), name='window'),
    path('ajax/', MapAjax.as_view(), name='ajax'),
    path('input/', MapInput.as_view(), name='input'),
    path('complete/', MapComplete.as_view(), name='complete'),
    path('detail/', MapDetail.as_view(), name='detail'),
]
