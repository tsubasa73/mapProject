from django.contrib.auth import get_user_model
from django.contrib.gis.db import models


class Location(models.Model):

    class Meta(object):
        db_table = 'location'

    point = models.PointField(srid=4326)
    zip_code = models.CharField(verbose_name='郵便番号', max_length=255, null=True, blank=True)
    address = models.CharField(verbose_name='住所', max_length=255, null=True, blank=True)


class Note(models.Model):

    class Meta(object):
        db_table = 'note'

    title = models.CharField(verbose_name='タイトル', max_length=255)
    text = models.TextField(verbose_name='本文', null=True, blank=True)
    image = models.ImageField(verbose_name='画像', null=True, blank=True)
    post_user = models.ForeignKey(get_user_model(), verbose_name='投稿者', on_delete=models.CASCADE)
    post_date = models.DateTimeField(verbose_name='投稿日時', null=True, blank=True)
    location = models.ForeignKey(Location, verbose_name='座標', on_delete=models.PROTECT)
    response_post = models.ForeignKey('self', verbose_name='返信先', null=True, blank=True, on_delete=models.PROTECT)

    def __str__(self):
        return self.title
