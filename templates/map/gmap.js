if (navigator.geolocation) {
} else {
  // Geolocation APIに対応していない場合アラートを表示
  alert("この端末では位置情報が取得できません");
}
// 現在地取得処理
function getPosition() {
  let geoSuccess = function (position) {
    initMap(position.coords.latitude, position.coords.longitude);
    return;
  };
  let geoError = function (error) {
    alert("現在地取得時にエラーが発生しました")
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

function initMap() {
  getPosition()
  var lat = 35.459933
  var lng = 139.6215775
  center = { lat: lat, lng: lng }

  var opts = {
    zoom: 16,
    center: center,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
  };
  let map = new google.maps.Map(document.getElementById('map'), opts);

  // マーカー追加
  marker = new google.maps.Marker({
    position: center, // マーカーを立てる位置を指定
    map: map, // マーカーを立てる地図を指定
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(50, 50)
    }
  })

  infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
    content: '<div">現在地はここ！</div>' // 吹き出しに表示する内容
  });
  infoWindow.open(map, marker)

  var marker = [];
  var infoWindow = [];

  // 全てのマーカーを作成
  {% for object in object_list %}
  marker[{{ forloop.counter0 }}] = new google.maps.Marker({
    position: { lat: {{ object.location.y }}, lng: {{ object.location.x }} },
    map: map
  });
  infoWindow[{{ forloop.counter0 }}] = new google.maps.InfoWindow({ // 吹き出しの追加
    content: '<div>' + '{{object.evacuation_site }}' + '</div>' // 吹き出しに表示する内容
  });
  // マーカーにクリックイベントを追加
  markerEvent({{ forloop.counter0 }}, {{ object.location.y }}, {{ object.location.x }}, '{{object.evacuation_site}}');
  {% endfor %}

  // マーカーにクリックイベントを追加
  function markerEvent(i, lat, lng, location) {
    marker[i].addListener('click', function () { // マーカーをクリックしたとき
      infoWindow[i].open(map, marker[i]); // 吹き出し表示
    }); // end marker[i].addListener
  }

};
