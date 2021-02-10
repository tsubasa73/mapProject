from django.views.generic import ListView
from .models import Location, Post


class Index(ListView):
    model = Location
    queryset = Location.objects.all()
    template_name = 'map/index.html'


class MapWindow(ListView):
    model = Location
    queryset = Location.objects.all()
    template_name = 'map/window.html'
