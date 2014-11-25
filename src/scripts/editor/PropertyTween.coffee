define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'
  _ = require 'lodash'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyTween.tpl.html'

  class PropertyTween
    # @instance_property: The current property on the data object.
    # @lineData: The line data object.
    constructor: (@instance_property, @lineData, @timer, @key_val = false) ->
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
      @lineData.isDirty = true

    update: () =>
      return "todo..."