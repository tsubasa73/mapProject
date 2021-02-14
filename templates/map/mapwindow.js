var map;
var marker_ary = new Array();
var data_str;
var currentInfoWindow;
var currentMarker;

if (navigator.geolocation) {
} else {
  // Geolocation APIに対応していない場合アラートを表示
  alert("この端末では位置情報が取得できません");
}

// 現在地取得処理
function getPosition() {
  var geoSuccess = position => initMap(position.coords.latitude, position.coords.longitude);
  var geoError = error => alert("現在地取得時にエラーが発生しました");
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

// クリックした地点の住所取得処理
function getClickedAddress(lat_lng, callback) {
  // 既にマーカーが存在してるなら削除
  if (currentMarker) {
    currentMarker.setMap();
  }
  // 位置情報から住所を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    location: lat_lng
  }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var address = results[0].formatted_address.split(/\s+/)[1];
      callback(lat_lng, address);
    }
  });
}

// 住所検索で該当の位置までマップ移動
function searchAddress(input_address, callback) {
  // 既にマーカーが存在してるなら削除
  if (currentMarker) {
    currentMarker.setMap();
  }
  // 住所から位置情報を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address: input_address
  }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var lat_lng = results[0].geometry.location;
      // 取得した位置情報から詳細な住所情報を取得
      geocoder.geocode({
        location: lat_lng
      }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK && results[0]) {
          var address = results[0].formatted_address.split(/\s+/)[1];
          callback(lat_lng, address);
          map.panTo(currentMarker.getPosition());
        }
      });
    }
  });
}

// 画面上のマーカーにクリックイベントを登録
function setClickEventToMarker(index, infoWindow) {
  marker_ary[index].addListener("click", () => {
    // 既に開いた情報ウィンドウがあれば閉じる
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }

    // 既にマーカーが存在してるなら削除
    if (currentMarker) {
      currentMarker.setMap();
    }

    // 情報ウィンドウを開く
    infoWindow.open(map, marker_ary[index]);

    // 開いた情報ウィンドウを記録しておく
    currentInfoWindow = infoWindow;

    // マーカーに該当するリストをクリック
    $(`#${index}`).trigger('click');
  });
}

// クリックした位置へのマーカー配置処理
function setClickedMarker(lat_lng, address){
  // 既にマーカーが存在してるなら削除
  if (currentMarker) {
    currentMarker.setMap();
  }

  // マーカー設置
  currentMarker = new google.maps.Marker({
    position: lat_lng,
    map: map,
    animation: google.maps.Animation.DROP,
  });

  // 情報ウィンドウの中身を作成
  info_str = `<div>${address}</div>
  <form action="{% url 'map:input' %}" method="POST">{% csrf_token %}
    <input type="hidden" name="lat" value="${lat_lng.lat()}">
    <input type="hidden" name="lng" value="${lat_lng.lng()}">
    <input type="hidden" name="address" value="${address}">
    <button type="submit" name="next" >ここで日記を投稿</button>
  </form>
  `
  // 情報ウィンドウ作成
  infoWindow = new google.maps.InfoWindow({
    content: '<div>' + info_str + '</div>'
  });

  // マーカーにクリックイベント登録
  currentMarker.addListener("click", () => {
    // 既に開いた情報ウィンドウがあれば閉じる
    if (currentInfoWindow) {
      currentInfoWindow.close();
    }
    // 情報ウィンドウを開く
    infoWindow.open(map, currentMarker);

    // 開いた情報ウィンドウを記録しておく
    currentInfoWindow = infoWindow;
  });

  // マーカーをクリックして情報ウィンドウ表示させる
  google.maps.event.trigger(currentMarker, "click");
}

// マーカー削除処理
function clearMarkers() {
  // 表示中のマーカーがあった場合
  if (marker_ary.length > 0) {
    // マーカー削除
    for (i = 0; i < marker_ary.length; i++) {
      marker_ary[i].setMap();
    }
    // 配列削除
    for (i = 0; i <= marker_ary.length; i++) {
      marker_ary.shift();
    }
  }
}

// マーカー配置処理
function setMarkers(index, value) {
  var markerOpts = {
    map: map,
    position: { lat: value['lat'], lng: value['lng'] },
  };
  marker_ary[index] = new google.maps.Marker(markerOpts);

  // 情報ウィンドウの文字列を作成
  info_str = `
  ${value['title']}<br/>
  ${value['address']}`;

  // 情報ウィンドウ作成
  var infoWindowOpts = {
    content: info_str
  };
  var infoWindow = new google.maps.InfoWindow(infoWindowOpts);

  // マーカーにクリックイベントを追加
  setClickEventToMarker(index, infoWindow);

  return marker_ary[index];
}

// <li>要素作成処理
function makeNoteList(index, value) {
  return `
  <li class="item" id="${index}">
    <div class="detailContainer">
      <p class="noteTitle">${value['title']}</p>
      <p class="noteAddress">${value['address']}</p>
      <div class="detailInfo" style="display: none;">
        <p class="noteDetail">posted date：${value['posted_date']}</p>
        <p class="noteDetail">author：${value['author']}</p>
          <div class="noteSearchButton" style="display: none;">
          <p class="noteSearchButtonDetail"><a onclick="to_detail(${value['id']})">詳細</a></p>
        </div>
      </div>
    </div>
  </li>`
}

// Ajaxで表示領域の座標を取得＆範囲内のマーカー表示処理
function setPointMarker() {

  // 地図の範囲内座標を取得
  var bounds = map.getBounds();
  map_ne_lat = bounds.getNorthEast().lat();
  map_sw_lat = bounds.getSouthWest().lat();
  map_ne_lng = bounds.getNorthEast().lng();
  map_sw_lng = bounds.getSouthWest().lng();

  // Ajaxでマーカー情報をJSONで取得
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
    timeout: 3000,
    error: function () {
      alert("情報の読み込みに失敗しました");
    },
    success: function (data) {
      // 画面内のマーカーに増減がなければ何もしない
      if (data.toString() == data_str){
        return;
      }
      // 取得したデータを記録
      data_str = data.toString()

      // リストの内容を削除
      $('.resultNotes').empty();

      // すべてのマーカーを削除
      clearMarkers();

      // 取得したデータの数だけループ
      $.each(data, function(index, value) {

        // 画面内にマーカーをセット
        var marker = setMarkers(index, value);

        // リスト作成
        list_str = makeNoteList(index, value);
        $(".resultNotes").append(list_str);

        // リストにクリックイベントを登録
        $(".item").click(function() {
          if (!$(this).hasClass("selected")) {
            $(".item.selected").find(".detailInfo").hide();
            $(".item.selected").find(".noteSearchButton").hide();
            $(".item.selected").removeClass("selected");
            $(this).find(".detailInfo").show();
            $(this).find(".noteSearchButton").show();
            $(this).addClass("selected");
            google.maps.event.trigger(marker, "click");
          }
        });
      });
    }
  });
}

// メイン処理
function initMap() {
  getPosition();
  var lat = 35.459933;
  var lng = 139.6215775;
  center = { lat: lat, lng: lng };

  var opts = {
    zoom: 16,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    clickableIcons: false,
  };
  map = new google.maps.Map(document.getElementById('map'), opts);

  // マップにクリックイベントを追加
  map.addListener('click', e => getClickedAddress(e.latLng, setClickedMarker));

  // 地図の表示領域が変更されたら表示領域の座標取得＆マーカー表示
  map.addListener('idle', setPointMarker);

  // 現在地にマーカー配置
  marker = new google.maps.Marker({
    position: center,
    map: map,
    icon: {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: new google.maps.Size(50, 50)
    },
  })

  infoWindow = new google.maps.InfoWindow({
    content: '<div">現在地はここ！</div>'
  });
  infoWindow.open(map, marker);

  // 検索ボックスの要素を取得
  var input = document.getElementById('placeSearchTextBox');
  // オートコンプリートのオプション
  var options = {
      types: ['(regions)'],
      componentRestrictions: {country: 'jp'}
  };
  // 検索ボックスにオートコンプリート機能を追加
  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener('place_changed', function() {
    input.value = this.getPlace().name;
  });

  // 検索ボタンにクリックイベントを登録
  $("#placeSearchButton").click(function() {
    if (!$("#placeSearchTextBox").val() == "") {
      searchAddress($("#placeSearchTextBox").val(), setClickedMarker)
    }
  });
};
