from django.contrib.gis import admin
from map.models import Location, Note, Response
from leaflet.admin import LeafletGeoAdmin

admin.site.register(Location, LeafletGeoAdmin)
admin.site.register(Note)
admin.site.register(Response)
