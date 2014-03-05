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
});

// stuff for the right click menus
function setupContextMenu() {
  $('div[data-role="arrayitem"]').contextMenu('context-menu1', {
    'remove item': {
      click: removeItem,
      klass: 'menu-item-1'
    },
  }, menuOptions);
  $('div[data-role="prop"]').contextMenu('context-menu2', {
    'remove item': {
      click: removeItem,
      klass: 'menu-item-1'
    },
  }, menuOptions);
}

function removeItem(element) {
  element.hide(500, function () {
    $(this).remove();
  });
}

var menuOptions = {
  disable_native_context_menu: true,
  showMenu: function (element) {
    element.addClass('dimmed');
  },
  hideMenu: function (element) {
    element.removeClass('dimmed');
  },
};

var easySaveValue = function (value, settings) { 
  $(this).text(value);
};

var saveValue = function (value, settings) { 
  console.log(this); console.log(value); // console.log(settings);

  if ($(this).data('role') == 'value') {
    if (value == 'null') {
      $(this).attr('data-type', 'null');
      $(this).data('type', 'null');
      $(this).text(value);
      $(this).unbind('click');
    } else if (value == 'true' || value == 'false') {
      $(this).attr('data-type', 'boolean');
      $(this).data('type', 'boolean');
      $(this).text(value);
      $(this).unbind();
      $(this).editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'100px', data: "{'true':'true','false':'false'}", type: 'select', onblur: 'submit' });
    } else {
      var num = parseFloat(value);
      console.log(num);
      if (isNaN(num)) {
        $(this).attr('data-type', 'string');
        $(this).data('type','string');
        $(this).text(value);
        $(this).unbind();
        $(this).editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'50px' });
      } else {
        $(this).attr('data-type', 'number');
        $(this).data('type','number');
        $(this).text(num);
        $(this).unbind();
        $(this).editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'150px' });
      }
    }
  } else {
    $(this).text(value);
  }
};

// copy the workspace back into the textarea
function extractJson(divid, indent){
  $('#json-input').val(gleanJson(divid, indent));
}

// convert the work area to a json string
function gleanJson(divid, indent)  {
  var base = $('#' + divid);
  var rootnode = base.children('div[data-role="value"]:first');
  var jsObject = parseNode(rootnode);
  var json = JSON.stringify(jsObject, null, indent);
  return json;
}

// convert the work area to a js object
function parseNode(node) {
  var type = node.data('type');
  if (type == 'object') {
    var newNode = new Object();
    var props = node.children('div[data-role="prop"]');
    props.each(function (index) {
      newNode[$(this).children('[data-role="key"]').html()] = parseNode($(this).children('[data-role="value"]'));
    });
    return newNode;
  } else if (type == 'array') {
    var newNode = new Array();
    var values = node.children('[data-role="arrayitem"]');
    values.each(function (index) {
      var valueNode = $(this).children('[data-role="value"]');
      newNode.push(parseNode(valueNode));
    });
    return newNode;
  } else if (type == 'string') {
    return node.html();
  } else if (type == 'number') {
    var parsedNum = parseFloat(node.html());
    if(isNaN(parsedNum)) return 0;
    return parsedNum;
  } else if (type == 'boolean') {
    return (node.html() == "true") ;
  } else if (type == null || type == 'null' ) {
    return null;
  } else {
    return "(Unknown Type:" + type + " )";
  }
}

function removeEditlets() {
  $("span.collapse-box").remove();
  $("div.inline-add-box").remove();
  $(".context-menu").remove();
}

function applyEditlets() {
  removeEditlets();
  // add collapse boxes for the arrays and objects
  var objectCollapseBox = $('<span class="collapse-box"><span>[-]</span><span style="display: none">[+] {...}</span></span>');
  var arrayCollapseBox = $('<span class="collapse-box"><span>[-]</span><span style="display: none" data-role="counter">[+] []</span></span>');
  $('div[data-type="object"]').before(objectCollapseBox);
  $('div[data-type="array"]').before(arrayCollapseBox);

  $('.collapse-box').click(function () {
    var $this = $(this),
      next = $this.next();

    next.toggle();
    $this.find('span').toggle();

    if (next.data('type') === 'array') {
      $this.find('span[data-role="counter"]').html('[+] ['+ next.children('[data-role="arrayitem"]').length +']' );
    }

    event.stopPropagation();
  });
  
  // add the "new" buttons
  var addMoreBox = $('<div class="inline-add-box"><div class="add-box-content">add: <a data-task="add-value">text</a> | <a data-task="add-array">array</a> | <a data-task="add-object">object</a></div></div>');

  $('div[data-type="object"]').append(addMoreBox);
  $('div[data-type="array"]').append(addMoreBox);
  
  $('div.inline-add-box a').on('click', function (e) {
    var target = $(e.target);
    var task = target.data('task');
    var addBox = target.parents('.inline-add-box');
    var collection = addBox.parent();				
    var type = collection.data('type');

    // TODO this code is a partial duplicate of code in makeNode fix it!
    if (type == 'object') {
      var newObj = $('<div data-role="prop"></div>')
        .append($('<span data-role="key">').append('key'))
        .append(': ');
    } else {
      var newObj = $('<div data-role="arrayitem"></div>');
    }
    
    if (task === 'add-object') {
      var json = '{"id":"1"}';
      newObj.append(makeNode(JSON.parse(json)));
    } else if (task === 'add-array') {
      var json = '["item1"]';
      newObj.append(makeNode(JSON.parse(json)));
    } else {
      newObj.append($('<pre data-role="value" data-type="string">').html('value'));
    }
    newObj.hide();
    addBox.before(newObj);
    newObj.show(500);
    applyEditlets();
    return false;
  });
  
  $('.inline-add-box').hover(
    function () {
      $(this).children().show(100);
    },
    function () {
      $(this).children().hide(200);
    }
  );

  // make the fields editable in place
  $('span[data-role="key"]').editable(easySaveValue, { cssclass: 'edit-box', height:'20px', width:'100px'});
  $('[data-type="string"]').editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'150px'});
  $('[data-type="number"]').editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'50px'});
  $('[data-type="null"]').editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'150px'});
  $('[data-type="boolean"]').editable(saveValue, { cssclass: 'edit-box', height:'20px', width:'100px', data: "{'true':'true','false':'false'}", type: 'select', onblur: 'submit' });

  
  // make the right click menus
  setupContextMenu();
}

// parse the text area into the the workarea, setup the event handlers
function loadJson() {
  var $editor = $('#json-editor');

  $editor.html('');
  $editor.tinker($('#json-input').val());
}

$.fn.tinker = function (jsonStr) {
  var json, base;

  try {
    json = JSON.parse(jsonStr);
  } catch (err) {
    json = JSON.parse('{"error": "parse failed"}');
  }

  this.append(makeNode(json));
  applyEditlets();
};

// recursively make html nodes out of the json
function makeNode(nodeIn) {
  var type = Object.prototype.toString.apply(nodeIn),
    container;

  if (type === '[object Object]') {
    container = makeValueRole('div', 'object');

    for(var prop in nodeIn) {
      if(nodeIn.hasOwnProperty(prop)) {
        var row = $('<div data-role="prop"></div>').append( $('<span data-role="key">').append(prop)).append(': ').append(makeNode(nodeIn[prop]));
        container.append(row);
      }
    }

    return container;
  } else if (type === '[object Array]') {
    container = makeValueRole('div', 'array');

    for (var i = 0, j = nodeIn.length; i < j; i++) {
      var row = $('<div data-role="arrayitem"></div>').append(makeNode(nodeIn[i]));
      container.append(row);
    }

    return container;
  } else if (type === '[object String]') {
    return makeValueRole('pre', 'string').html(nodeIn);
  } else if (type === '[object Number]') {
    return makeValueRole('pre', 'number').html(nodeIn);
  } else if (type === '[object global]' || type === '[object Null]') {
    return makeValueRole('pre', 'null').html('null');
  } else if (type === '[object Boolean]') {
    return makeValueRole('pre', 'boolean').html(nodeIn.toString());
  }
}

function makeValueRole(tag, type) {
  return $('<' + tag + '/>').attr('data-role', 'value')
    .attr('data-type', type);
}
