$ = require 'jquery'
Signals = require 'js-signals'

Mustache = require 'mustache.js'
tpl_property = require 'html!../templates/propertyTween.tpl.html'

class PropertyTween
  # @instance_property: The current property on the data object.
  # @lineData: The line data object.
  constructor: (@instance_property, @lineData, @editor, @key_val = false, @timeline) ->
    @timer = @editor.timer
    @$time = false
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
    @$time = @$el.find('.property__key-time strong')
    @$time.keypress (e) =>
      if e.charCode == 13
        # Enter
        e.preventDefault()
        @$time.blur()
        @updateKeyTime(@$time.text())

    @$time.on 'click', () -> document.execCommand('selectAll', false, null)
    @$el.find('select').change(@onChange)
    return

  updateKeyTime: (time) =>
    time = parseFloat(time)
    if isNaN(time)
      time = @key_val.time

    @$time.text(time)
    @key_val.time = time
    @onChange()

  onChange: () =>
    ease = @$el.find('select').val()
    @key_val.ease = ease
    @editor.undoManager.addState()
    @lineData._isDirty = true
    @timeline._isDirty = true
    return

  update: () =>
    # todo: use mustache instead...
    @$time.html(@key_val.time.toFixed(3))
    return

module.exports = PropertyTween
