$(function () {
  $(document).bind('contextmenu', function () {
    return false;
  }); 

  $('#load-json').on('click', function () {
    loadJson();
  });

  $('#extract-json').on('click', function () {
    extractJson('json-editor', 2);
  });
        
  $('#json-editor').tinker('{"greeting":"haro"}');

  $('#json-input').click(function () {
    $(this).focus();
    $(this).select();
  });

  // parse the text area into the the workarea, setup the event handlers
  function loadJson() {
    var $editor = $('#json-editor');

    $editor.html('');
    $editor.tinker($('#json-input').val());
  }
});
