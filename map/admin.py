from django.contrib.gis import admin
from map.models import Location, Post
from leaflet.admin import LeafletGeoAdmin

admin.site.register(Location, LeafletGeoAdmin)
admin.site.register(Post)
