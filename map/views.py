import json

from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.shortcuts import redirect, resolve_url, render
from django.urls import reverse_lazy, reverse
from django.views.generic import View, TemplateView, CreateView
from django.contrib.gis.geos import Polygon, Point

from .forms import NoteForm, ResponseForm, LoginForm
from .models import Note, Location, Response


class MapLogin(View):
    def get(self, request):
        context = {'form': LoginForm()}
        return render(request, 'map/login.html', context)

    def post(self, request):
        form = LoginForm(request.POST)
        if not form.is_valid():
            return render(request, 'map/login.html', {'form': form})
        user = form.get_user()
        login(request, user)
        messages.info(request, "ログインしました。")
        return redirect(reverse('map:window'))


class MapLogout(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        messages.info(request, "ログアウトしました。")
        return redirect(reverse('map:login'))


class MapWindow(LoginRequiredMixin, TemplateView):
    template_name = 'map/window.html'


class MapAjax(LoginRequiredMixin, View):
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


class MapInput(LoginRequiredMixin, CreateView):
    template_name = 'map/input.html'
    model = Note
    form_class = NoteForm
    success_url = reverse_lazy('map:complete')

    def form_valid(self, form):
        lat = self.request.POST.get('lat')
        lng = self.request.POST.get('lng')
        address = self.request.POST.get('address')
        if self.request.POST.get('next') == 'create':
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


class MapComplete(LoginRequiredMixin, TemplateView):
    template_name = 'map/complete.html'


class MapDetail(LoginRequiredMixin, CreateView):
    template_name = 'map/detail.html'
    model = Response
    form_class = ResponseForm
    
    def form_valid(self, form):
        note_id = self.request.POST.get('note_id')
        form.instance.response_note = Note.objects.get(id=note_id)
        form.instance.author = self.request.user
        return super().form_valid(form)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['note'] = Note.objects.get(id=self.kwargs['pk'])
        context['response_list'] = Response.objects.filter(response_note__id=self.kwargs['pk'])
        return context

    def get_success_url(self):
        return resolve_url('map:detail', pk=self.kwargs['pk'])
