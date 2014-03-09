$(function () {
  
  var $raw = $('#config-raw');
  var $visual = $('#config-visual').tinker({ json: $raw.val() });
  
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {    
    if (e.target.hash === '#raw') {
      $raw.val($visual.tinker('json'));
    } else {
      $visual.tinker({ json: $raw.val() });
    }
  });
  
//  $(document).bind('contextmenu', function () {
//    return false;
//  }); 
//
//  $('#load-json').on('click', function () {
//    var json = $input.val();
//    $editor.tinker({ json: json });
//  });
//
//  $('#extract-json').on('click', function () {
//    var json = $editor.tinker('json');
//    $input.val(json);
//  });
//
//  $input.click(function () {
//    $(this).focus();
//    $(this).select();
//  });
  
});
