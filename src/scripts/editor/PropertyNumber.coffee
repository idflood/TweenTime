$ = require 'jquery'
Signals = require 'js-signals'
_ = require 'lodash'
d3 = require 'd3'
Utils = require '../core/Utils'
PropertyBase = require './PropertyBase.coffee'
DraggableNumber = require 'draggable-number.js'

Mustache = require 'mustache.js'
console.log Mustache
tpl_property = require 'html!../templates/propertyNumber.tpl.html'

class PropertyNumber extends PropertyBase
  # @instance_property: The current property on the data object.
  # @lineData: The line data object.
  constructor: (@instance_property, @lineData, @editor, @key_val = false) ->
    super
    @$input = @$el.find('input')

  getInputVal: () =>
    parseFloat(@$el.find('input').val())

  render: () =>
    super
    # By default assign the property default value
    val = @getCurrentVal()

    data =
      id: @instance_property.name # "circleRadius" instead of "circle radius"
      label: @instance_property.label || @instance_property.name
      val: val

    view = Mustache.render(tpl_property, data)
    @$el = $(view)
    @$el.find('.property__key').click(@onKeyClick)

    $input = @$el.find('input')


    onChangeEnd = (new_val) =>
      @editor.undoManager.addState()

    draggable = new DraggableNumber($input.get(0), {
      changeCallback: @onInputChange,
      endCallback: onChangeEnd
    })
    $input.data('draggable', draggable)
    $input.change(@onInputChange)

  update: () =>
    super
    val = @getCurrentVal()
    draggable = @$input.data('draggable')

    if draggable
      draggable.set(val.toFixed(3))
    else
      @$input.val(val.toFixed(3))

module.exports = PropertyNumber
