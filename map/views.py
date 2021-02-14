import json

from django.http import HttpResponse
from django.views.generic import View, TemplateView, ListView
from django.contrib.gis.geos import Polygon

from .models import Location, Note


class Index(TemplateView):
    template_name = 'map/index.html'


class MapWindow(ListView):
    template_name = 'map/window.html'
    model = Location


class AjaxResponse(View):
    template_name = 'map/window.html'
    model = Note

    def get(self, request):
        if request.is_ajax():
            y_max = request.GET.get("map_ne_lat")
            y_min = request.GET.get("map_sw_lat")
            x_max = request.GET.get("map_ne_lng")
            x_min = request.GET.get("map_sw_lng")
            poly = Polygon.from_bbox((x_min, y_min, x_max, y_max))

            queryset = Note.objects.all().select_related('location')
            points = [{'id': note.id, 'lat': note.location.point.y, 'lng': note.location.point.x,
                       'address': note.location.address, 'title': note.title,
                       'post_user': note.post_user.username, 'post_date': f'{note.post_date:%Y/%m/%d %H:%M:%S}'}
                      for note in queryset if poly.contains(note.location.point)]

            return HttpResponse(json.dumps(points))
