# Draggable-number.js [![Build Status](https://travis-ci.org/idflood/draggable-number.js.png?branch=master)](https://travis-ci.org/idflood/draggable-number.js) [![Coverage Status](https://coveralls.io/repos/idflood/draggable-number.js/badge.png?branch=master)](https://coveralls.io/r/idflood/draggable-number.js?branch=master)
Display number as simple text but allow click + drag to change the value. If the
number is simply clicked then it displays an input so that a precise value can
be entered.

## Getting Started:
With [Bower](http://bower.io): `$ bower install --save draggable-number.js`

Or manually download the [latest release](https://github.com/idflood/draggable-number.js/releases).

## Usage:
Include the draggable-number.min.js file and then call `new DraggableNumber(element)`.

```html
<input class="numeric-input" value="42" />
<script src="dist/draggable-number.min.js"></script>
<script>
  new DraggableNumber(document.getElementsByClassName('numeric-input')[0]);
</script>
```

## Options:
You can set the draggableNumber options when creating a new instance,

```javascript
new DraggableNumber(element, {
  min: 0,
  max: 100,
  dragThreshold: 5
});
```

## API:

### item.get()
Return the current value as float.

```javascript
var value = item.get();
```

### item.set(value)
Set the value of the element. This update the input and span value.

```javascript
item.set(42);
```

### item.setMin(value)
Set the minimum value.

```javascript
item.setMin(5);
```

### item.setMax(value)
Set the maximum value.

```javascript
item.setMax(5);
```

### item.destroy()
Remove the DraggableNumber element, leaving the original input field.

```javascript
item.destroy();
```
