// ログイン失敗時のスクロール位置を記録する
$('form').submit(function() {
  var scroll = $(window).scrollTop();
  $('input.sc', this).prop('value', scroll);
});

//ロード時に隠しフィールドから取得した値で位置をスクロール
{% if form.scroll.value %}
window.onload = function() {
  $(window).scrollTop({{ form.scroll.value }});
}
{% endif %}
