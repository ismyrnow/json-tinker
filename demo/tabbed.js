$(function () {
  
  var $raw = $('#config-raw');
  var $yaml = $('#config-yaml');
  var $visual = $('#config-visual').tinker({ json: $raw.val() });
  
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    var activatedTab = e.target.hash;
    var previousTab = e.relatedTarget.hash;
    var json;
    
    // Get json from previous tab.
    switch (previousTab) {
      case '#visual':
        json = $visual.tinker('json');
        break;
      case '#yaml':
        json = JSON.stringify(jsyaml.load($yaml.val()), null, 2);
        break;
      default:
        json = $raw.val();
        break;
    }
    
    // Update activated tab with latest json.
    switch (activatedTab) {
      case '#visual':
        $visual.tinker({ json: json });
        break;
      case '#yaml':
        $yaml.val(jsyaml.dump(JSON.parse(json)));
        break;
      case '#raw':
        $raw.val(json);
        break;
    }
  });
  
});
