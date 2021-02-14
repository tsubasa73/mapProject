from django.contrib.gis import admin
from map.models import Location, Note
from leaflet.admin import LeafletGeoAdmin

admin.site.register(Location, LeafletGeoAdmin)
admin.site.register(Note)
