# JSON Tinker - jQuery Plugin

Editing JSON in the browser.

## Usage

```javascript
var $editor = $('#editor');

// Initialize editor with some json.
$editor.tinker({ json: '{ "hello": "world" }');

// Alternatively, you can initialize with an object.
$editor.tinker({ object: { hello: 'world' } });

// User makes some changes...

// Get modified json or object back.
var jsonString = $editor.tinker('json');
var jsObject = $editor.tinker('object');
```