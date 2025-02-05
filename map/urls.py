from django.urls import path

from .views import MapLogin, MapLogout, MapWindow, MapAjax, MapInput, MapComplete, MapDetail

app_name = 'map'
urlpatterns = [
    path('login/', MapLogin.as_view(), name='login'),
    path('logout/', MapLogout.as_view(), name='logout'),
    path('window/', MapWindow.as_view(), name='window'),
    path('ajax/', MapAjax.as_view(), name='ajax'),
    path('input/', MapInput.as_view(), name='input'),
    path('complete/', MapComplete.as_view(), name='complete'),
    path('detail/<int:pk>', MapDetail.as_view(), name='detail'),
]
