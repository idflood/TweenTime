define (require) ->
  $ = require 'jquery'
  require 'spectrum'
  Signals = require 'Signal'
  _ = require 'lodash'
  d3 = require 'd3'
  Utils = require 'cs!core/Utils'
  PropertyBase = require 'cs!editor/PropertyBase'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyColor.tpl.html'

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

      $input.change(@onInputChange)

    update: () =>
      super
      val = @getCurrentVal()
      @$input.val(val)