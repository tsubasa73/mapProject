from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.utils import timezone


class Location(models.Model):

    class Meta(object):
        db_table = 'location'

    point = models.PointField(srid=4326)
    address = models.CharField(verbose_name='住所', max_length=255, null=True, blank=True)


class Note(models.Model):

    class Meta(object):
        db_table = 'note'

    title = models.CharField(verbose_name='タイトル', max_length=255)
    text = models.TextField(verbose_name='本文', null=True, blank=True)
    image = models.ImageField(verbose_name='画像', null=True, blank=True)
    author = models.ForeignKey(get_user_model(), verbose_name='投稿者', on_delete=models.CASCADE)
    posted_date = models.DateTimeField(verbose_name='投稿日時', null=True, blank=True, default=timezone.now)
    location = models.ForeignKey(Location, verbose_name='座標', on_delete=models.PROTECT)

    def __str__(self):
        return self.title


class Response(models.Model):

    class Meta(object):
        db_table = 'response'

    text = models.TextField(verbose_name='本文')
    author = models.ForeignKey(get_user_model(), verbose_name='投稿者', on_delete=models.CASCADE)
    posted_date = models.DateTimeField(verbose_name='投稿日時', null=True, blank=True, default=timezone.now)
    response_note = models.ForeignKey(Note, verbose_name='返信先', on_delete=models.CASCADE)
