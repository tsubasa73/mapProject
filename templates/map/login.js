{% if anchor %}
$(document).ready(function(){
  window.location = "#{{ anchor }}"
});
{% endif %}
