# JSON Tinker - jQuery Plugin

Editing JSON in the browser.

## Usage

```javascript
var $editor = $('#editor');

// Initialize editor with some json.
$editor.tinker({ json: '{ "hello": "world" }');

// User makes some changes...

// Get modified json back.
var jsonString = $editor.tinker('json');
```