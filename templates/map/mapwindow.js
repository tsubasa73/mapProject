{% load static %}

var map;
var marker_ary = new Array();
var data_str = "";
var clickedMarker;
var clickedMarkerInfoWindow;
var currentMarker;
var currentLatLng;

// 現在地マーカーへの移動ボタンを設置
function addMyLocationButton() {
  var controlDiv = document.createElement('div');

  var firstChild = document.createElement('button');
  firstChild.style.backgroundColor = '#fff';
  firstChild.style.border = 'none';
  firstChild.style.outline = 'none';
  firstChild.style.width = '40px';
  firstChild.style.height = '40px';
  firstChild.style.borderRadius = '2px';
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  firstChild.style.cursor = 'pointer';
  firstChild.style.marginRight = '10px';
  firstChild.style.padding = '0px';
  firstChild.title = 'My Location';
  controlDiv.appendChild(firstChild);

  var secondChild = document.createElement('div');
  secondChild.style.margin = '0px';
  secondChild.style.width = '40px';
  secondChild.style.height = '40px';
  secondChild.style.backgroundImage = 'url({% static "images/mylocation.svg" %})';
  secondChild.style.backgroundSize = '40px 40px';
  secondChild.style.backgroundPosition = '0px 0px';
  secondChild.style.backgroundRepeat = 'no-repeat';
  secondChild.id = 'my_location_img';
  firstChild.appendChild(secondChild);

  firstChild.addEventListener('click', () => {
    map.panTo(currentLatLng);
  });
  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

// クリックした地点の住所取得処理
function getClickedAddress(latlng, callback) {
  // 既にマーカーが存在してるなら削除
  if (clickedMarker) {
    clickedMarker.setMap();
  }
  // 位置情報から住所を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    location: latlng
  }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var address = results[0].formatted_address.split(/\s+/)[1];
      callback(latlng, address);
    }
  });
}

// 住所検索で該当の位置までマップ移動
function searchAddress(input_address, callback) {
  // 既にマーカーが存在してるなら削除
  if (clickedMarker) {
    clickedMarker.setMap();
  }
  // 住所から位置情報を取得
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    address: input_address
  }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK && results[0]) {
      var latlng = results[0].geometry.location;
      // 取得した位置情報から詳細な住所情報を取得
      geocoder.geocode({
        location: latlng
      }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK && results[0]) {
          var address = results[0].formatted_address.split(/\s+/)[1];
          callback(latlng, address);
          map.panTo(clickedMarker.getPosition());
        }
      });
    }
  });
}

// 画面上のマーカーにクリックイベントを登録
function setClickEventToMarker(index, infoWindow) {
  marker_ary[index].addListener("click", () => {
    // 既に開いた情報ウィンドウがあれば閉じる
    if (clickedMarkerInfoWindow) {
      clickedMarkerInfoWindow.close();
    }

    // 既にマーカーが存在してるなら削除
    if (clickedMarker) {
      clickedMarker.setMap();
    }

    // 情報ウィンドウを開く
    infoWindow.open(map, marker_ary[index]);

    // 開いた情報ウィンドウを記録しておく
    clickedMarkerInfoWindow = infoWindow;

    // マーカーに該当するリストをクリック
    $(`#${index}`).trigger('click');
  });
}

// クリックした位置にマーカーを配置
function setClickedMarker(latlng, address){
  // 既にマーカーが存在してるなら削除
  if (clickedMarker) {
    clickedMarker.setMap();
  }

  // マーカー設置
  clickedMarker = new google.maps.Marker({
    position: latlng,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: {
      url: "http://maps.google.co.jp/mapfiles/ms/icons/green-dot.png",
      scaledSize: new google.maps.Size(40, 40)
    },
  });

  // 情報ウィンドウの中身を作成
  var info_str = `<div>${address}</div>
  <form action="{% url 'map:input' %}" method="POST">{% csrf_token %}
    <input type="hidden" name="lat" value="${latlng.lat()}">
    <input type="hidden" name="lng" value="${latlng.lng()}">
    <input type="hidden" name="address" value="${address}">
    <p class="submitButton"><button type="submit" name="next">日記を投稿</button></p>
  </form>
  `
  // 情報ウィンドウ作成
  infoWindow = new google.maps.InfoWindow({
    content: '<div>' + info_str + '</div>'
  });

  // マーカーにクリックイベント登録
  clickedMarker.addListener("click", () => {
    // 既に開いた情報ウィンドウがあれば閉じる
    if (clickedMarkerInfoWindow) {
      clickedMarkerInfoWindow.close();
    }
    // 情報ウィンドウを開く
    infoWindow.open(map, clickedMarker);

    // 開いた情報ウィンドウを記録しておく
    clickedMarkerInfoWindow = infoWindow;
  });
  // マーカーをクリックして情報ウィンドウ表示させる
  google.maps.event.trigger(clickedMarker, "click");
}

// マーカー削除
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

// 画面上にマーカー配置
function setMarkers(index, value) {
  var markerOpts = {
    map: map,
    position: {lat: value['lat'], lng: value['lng']},
  };
  marker_ary[index] = new google.maps.Marker(markerOpts);

  // 情報ウィンドウの文字列を作成
  var info_str = `
  <div class="infoWindowContainer">
  <p class="infoWindowTitle">${value['title']}</p>
  <p class="infoWindowAddress">${value['address']}</p>
  <p class="infoWindowDetailButton"><a onclick="location.href='/map/detail/${value['id']}';">日記を見る</a></p>
  </div>`;

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
          <p class="noteSearchButtonDetail"><a onclick="location.href='/map/detail/${value['id']}';">日記を見る</a></p>
        </div>
      </div>
    </div>
  </li>`
}

// 表示領域の座標を取得＆範囲内のマーカーを表示
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
    error: () => {
      alert("情報の読み込みに失敗しました");
    },
    success: (data) => {
      // 画面内のマーカーに増減がなければ何もしない
      if (data.toString() == data_str){
        return;
      }
      // 取得したデータを記録
      data_str = data.toString();

      // リストの内容を削除
      $('.resultNotes').empty();

      // すべてのマーカーを削除
      clearMarkers();

      // 取得したデータの数だけループ
      $.each(data, function(index, value) {
        // 画面内にマーカーをセット
        var marker = setMarkers(index, value);

        // リスト作成
        var list_str = makeNoteList(index, value);
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

// 現在地マーカー配置
function updateCurrentMarker() {
  if (currentMarker){
    currentMarker.setMap();
  }
  currentMarker = new google.maps.Marker({
    position: currentLatLng,
    map: map,
    icon: {
      url: "{% static 'images/currentlocation.png' %}",
      scaledSize: new google.maps.Size(40, 40)
    },
  })
}

// 現在地マーカーの定期更新処理をセット
function updateCurrentPosition() {
  return new Promise((resolve, reject) => {
    // 位置情報取得に成功したら現在地マーカーを配置
    var success = (position) => {
      currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);
      updateCurrentMarker();
      resolve();
    };
    var error = null;

    // watchPositionのオプション
    var options = {
      timeout: 10000,
      maximumAge: 10000,
      enableHighAccuracy: false,
    };
    navigator.geolocation.watchPosition(success, error, options);
  })
}

// 初回現在地取得
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Geolocation APIに対応していない場合アラートを表示
      alert("この端末では位置情報が取得できません");
    }
    // 位置情報取得に成功したら現在地マーカーを配置
    var success = (position) => {
      currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, false);
      resolve(currentLatLng);
    };
    var error = () => {
      //alert("現在地が取得できませんでした");
      // 東京駅をデフォルトに設定
      var lat = 35.6803997;
      var lng = 139.7690174;
      currentLatLng = new google.maps.LatLng(lat, lng, false);
      reject(currentLatLng);
    };
    // getCurrentPositionのオプション
    var options = {
      timeout: 10000,
      enableHighAccuracy: false,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  })
}

// メイン処理
async function initMap() {
  await getCurrentPosition().catch(() => {});
  var opts = {
    zoom: 16,
    center: currentLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    clickableIcons: false,
  };
  map = new google.maps.Map(document.getElementById('map'), opts);

  // 現在地にマーカー配置
  updateCurrentMarker(currentLatLng);

  // 現在地マーカーへの移動ボタンを設置
  addMyLocationButton();

  // 現在地マーカーを更新し続ける
  updateCurrentPosition();

  // マップにクリックイベントを追加
  map.addListener('click', e => getClickedAddress(e.latLng, setClickedMarker));

  // 地図の表示領域が変更されたら表示領域の座標取得＆マーカー表示
  google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
    map.addListener('idle', setPointMarker);
  });

  // 検索ボックスの要素を取得
  var input = document.getElementById('placeSearchTextBox');

  // オートコンプリートのオプション
  var options = {
      types: ['(regions)'],
      componentRestrictions: {country: 'jp'}
  };
  
  // 検索ボックスにオートコンプリート機能を追加
  var autocomplete = new google.maps.places.Autocomplete(input, options);
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
