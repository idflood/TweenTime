$ = require 'jquery'
require 'spectrum'
Signals = require 'js-signals'
_ = require 'lodash'
d3 = require 'd3'
Utils = require '../core/Utils.coffee'
PropertyBase = require './PropertyBase.coffee'

Mustache = require 'mustache.js'
tpl_property = require 'html!../templates/propertyColor.tpl.html'

class PropertyColor extends PropertyBase
  constructor: (@instance_property, @lineData, @editor, @key_val = false) ->
    super
    @$input = @$el.find('input')

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

    $input.spectrum({
      allowEmpty: false,
      showAlpha: true,
      clickoutFiresChange: false,
      preferredFormat: "rgb",
      change: (color) =>
        @editor.undoManager.addState()
      ,
      move: (color) =>
        if color._a == 1
          @$input.val(color.toHexString())
        else
          @$input.val(color.toRgbString())
        @onInputChange()
    })

    $input.change(@onInputChange)

  update: () =>
    super
    val = @getCurrentVal()
    @$input.val(val)
    @$input.spectrum('set', val)

module.exports = PropertyColor