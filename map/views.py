import json
from django.http import HttpResponse
from django.views.generic import View, ListView
from django.contrib.gis.geos import Polygon

from .models import Location, Post


class Index(ListView):
    template_name = 'map/index.html'
    model = Location


class MapWindow(ListView):
    template_name = 'map/window.html'
    model = Location


class AjaxResponse(View):
    template_name = 'map/window.html'
    model = Location

    def get(self, request):
        if request.is_ajax():
            ymax = request.GET.get("map_ne_lat")
            ymin = request.GET.get("map_sw_lat")
            xmax = request.GET.get("map_ne_lng")
            xmin = request.GET.get("map_sw_lng")
            bbox = (xmin, ymin, xmax, ymax)
            geom = Polygon.from_bbox(bbox)
            queryset = Location.objects.filter(location__contained=geom)
            points = [{'lat': obj.location.y, 'lng': obj.location.x} for obj in queryset]
            return HttpResponse(json.dumps(points))
