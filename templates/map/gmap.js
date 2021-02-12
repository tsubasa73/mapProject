var map;
var marker_ary = new Array();
var currentInfoWindow;
var currentMarker;

if (navigator.geolocation) {
} else {
  // Geolocation APIに対応していない場合アラートを表示
  alert("この端末では位置情報が取得できません");
}
// 現在地取得処理
function getPosition() {
  let geoSuccess = position => initMap(position.coords.latitude, position.coords.longitude);
  let geoError = error => alert("現在地取得時にエラーが発生しました");
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

// クリックした位置にマーカーを配置
function getClickLatLng(lat_lng, map) {
  // 既にマーカーが存在してるなら削除
  if (currentMarker) {
    currentMarker.setMap();
  }
  // マーカー設置
  currentMarker = new google.maps.Marker({
    position: lat_lng,
    map: map
  });
  infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
    content: '<div">日記を投稿</div>' // 吹き出しに表示する内容
  });
  infoWindow.open(map, currentMarker);
}

//マーカー削除
function MarkerClear() {
  //表示中のマーカーがあれば削除
  if (marker_ary.length > 0) {
    //マーカー削除
    for (i = 0; i < marker_ary.length; i++) {
      marker_ary[i].setMap();
    }
    //配列削除
    for (i = 0; i <= marker_ary.length; i++) {
      marker_ary.shift();
    }
  }
}

// マーカー配置
function MarkerSet(lat, lng, text) {
  var marker_num = marker_ary.length;
  var markerOpts = {
    map: map,
    position: { lat: lat, lng: lng },
  };
  marker_ary[marker_num] = new google.maps.Marker(markerOpts);

  //textが渡されていたらふきだしをセット
  if (text.length > 0) {
    var infoWindowOpts = {
      content: text
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOpts);

    marker_ary[marker_num].addListener("click", () => {
      //先に開いた情報ウィンドウがあれば、closeする
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      //情報ウィンドウを開く
      infoWindow.open(map, marker_ary[marker_num]);
      //開いた情報ウィンドウを記録しておく
      currentInfoWindow = infoWindow;
    });
  }
}

// Ajaxで表示領域の座標を取得＆範囲内のマーカーを表示
function setPointMarker() {
  //リストの内容を削除
  $('.resultContents > ul').empty();

  //マーカー削除
  MarkerClear();

  //地図の範囲内座標を取得
  var bounds = map.getBounds();
  map_ne_lat = bounds.getNorthEast().lat();
  map_sw_lat = bounds.getSouthWest().lat();
  map_ne_lng = bounds.getNorthEast().lng();
  map_sw_lng = bounds.getSouthWest().lng();

  // JSON取得
  $.ajax({
    url: "{% url 'map:ajax' %}",
    type: 'GET',
    dataType: 'json',
    data: {
      map_ne_lat: map_ne_lat,
      map_sw_lat: map_sw_lat,
      map_ne_lng: map_ne_lng,
      map_sw_lng: map_sw_lng,
    },
    timeout: 1000,
    error: function () {
      alert("情報の読み込みに失敗しました");
    },
    success: function (data) {
      //帰ってきた地点の数だけループ
      $.each(data, function(index, value) {

        var text = "";
        //マーカーをセット
        MarkerSet(value['lat'], value['lng'], text);

        //リストに対応するマーカー配列キーをセット
        var marker_num = marker_ary.length - 1;

        //liとaタグをセット
        loc = $('<li>').append($('<a href="javascript:void(0)"/>').text("hogehoge"));

        //セットしたタグにイベント「マーカーがクリックされた」をセット
        loc.bind('click', function () {
          google.maps.event.trigger(marker_ary[marker_num], 'click');
        });

        //リスト表示
        $('.resultContents > ul').append(loc);
      });
    }
  });
}

function initMap() {
  getPosition();
  var lat = 35.459933;
  var lng = 139.6215775;
  center = { lat: lat, lng: lng };

  var opts = {
    zoom: 16,
    center: center,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    clickableIcons: false,
  };
  map = new google.maps.Map(document.getElementById('map'), opts);

  // クリックイベントを追加
  map.addListener('click', e => getClickLatLng(e.latLng, map));

  // 地図の表示領域が変更されたら表示領域の座標取得＆マーカー表示
  map.addListener('idle', setPointMarker);

  // マーカー追加
  marker = new google.maps.Marker({
    position: center, // マーカーを立てる位置を指定
    map: map, // マーカーを立てる地図を指定
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(50, 50)
    },
  })

  infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
    content: '<div">現在地はここ！</div>' // 吹き出しに表示する内容
  });
  infoWindow.open(map, marker);


};
