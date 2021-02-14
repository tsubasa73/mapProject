import json

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import View, TemplateView, FormView, CreateView, DetailView
from django.contrib.gis.geos import Polygon, Point

from .forms import NoteForm
from .models import Note, Location


class MapIndex(TemplateView):
    template_name = 'map/index.html'


class MapWindow(TemplateView):
    template_name = 'map/window.html'


class MapAjax(View):
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
                       'author': note.author.username, 'posted_date': f'{note.posted_date:%Y/%m/%d %H:%M:%S}'}
                      for note in queryset if poly.contains(note.location.point)]
            
            return HttpResponse(json.dumps(points))


class MapInput(CreateView):
    template_name = 'map/input.html'
    model = Note
    form_class = NoteForm
    success_url = reverse_lazy('map:complete')

    def form_valid(self, form):
        lat = self.request.POST.get('lat')
        lng = self.request.POST.get('lng')
        address = self.request.POST.get('address')
        context = {'form': form, 'lat': lat, 'lng': lng, 'address': address}
        if self.request.POST.get('next') == 'confirm':
            return render(self.request, 'map/confirm.html', context)
        elif self.request.POST.get('next') == 'back':
            return render(self.request, 'map/input.html', context)
        elif self.request.POST.get('next') == 'create':
            loc_obj = Location.objects.create(point=Point(float(lng), float(lat)), address=address)
            form.instance.location = loc_obj
            form.instance.author = self.request.user
            return super().form_valid(form)
        else:
            return redirect(reverse_lazy('map:window'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lat'] = self.request.POST.get('lat')
        context['lng'] = self.request.POST.get('lng')
        context['address'] = self.request.POST.get('address')
        return context


class MapComplete(TemplateView):
    template_name = 'map/complete.html'


class MapDetail(DetailView):
    template_name = 'map/detail.html'
    model = Note
