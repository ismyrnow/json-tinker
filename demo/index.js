$(function () {
  var $input = $('#json-input');
  var $editor = $('#json-editor').tinker({ json: '{"greeting":"haro"}' });
  
  $(document).bind('contextmenu', function () {
    return false;
  }); 

  $('#load-json').on('click', function () {
    var json = $input.val();
    $editor.tinker({ json: json });
  });

  $('#extract-json').on('click', function () {
    var json = $editor.tinker('json');
    $input.val(json);
  });

  $input.click(function () {
    $(this).focus();
    $(this).select();
  });
});
