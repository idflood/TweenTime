define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'
  _ = require 'lodash'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyTween.tpl.html'

  class PropertyTween
    # @property: Static property definition (ex: {name: 'x', label: 'x', val: 0})
    # @instance_property: The current property on the data object.
    # @object: The parent object.
    constructor: (@property, @instance_property, @object, @timer, @key_val = false) ->
      @render()

    render: () =>
      self = this
      if !@key_val.ease then @key_val.ease = "Quad.easeOut"
      data =
        id: @instance_property.name + "_tween"
        val: @key_val.ease
        options: [
          'Linear.easeNone'
        ]
        selected: () ->
          if this.toString() == self.key_val.ease then 'selected' else ''

      tweens = ["Quad", "Cubic", "Quart", "Quint", "Strong"]
      for tween in tweens
        data.options.push(tween + ".easeOut")
        data.options.push(tween + ".easeIn")
        data.options.push(tween + ".easeInOut")

      @$el = $(Mustache.render(tpl_property, data))
      @$el.find('select').change(@onChange)

    onChange: () =>
      ease = @$el.find('select').val()
      @key_val.ease = ease
      console.log "on change: " + ease
      console.log this
      @object.isDirty = true

    update: () =>
      return "todo..."