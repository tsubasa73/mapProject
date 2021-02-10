import os
from map.models import Location
from django.contrib.gis.utils import LayerMapping

# ModelとGeojsonファイルのカラムのマッピング
mapping = {
    'location': 'POINT',
}

# ファイルパス
geojson_file = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'sample.geojson'))


# 実行
def run(verbose=True):
    lm = LayerMapping(Location, geojson_file,
                      mapping, transform=False, encoding='UTF-8')
    lm.save(strict=True, verbose=verbose)
