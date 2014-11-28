define (require) ->
  $ = require 'jquery'
  Signals = require 'Signal'

  Mustache = require 'Mustache'
  tpl_property = require 'text!templates/propertyTween.tpl.html'

  class PropertyTween
    # @instance_property: The current property on the data object.
    # @lineData: The line data object.
    constructor: (@instance_property, @lineData, @editor, @key_val = false, @timeline) ->
      @timer = @editor.timer
      @render()

    render: () =>
      self = this
      if !@key_val.ease then @key_val.ease = "Quad.easeOut"
      data =
        id: @instance_property.name + "_tween"
        val: @key_val.ease
        time: @key_val.time.toFixed(3)
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
      @editor.undoManager.addState()
      @lineData.isDirty = true
      @timeline.isDirty = true

    update: () =>
      # todo: use mustache instead...
      @$el.find('.property__key-time strong').html(@key_val.time.toFixed(3))
      return