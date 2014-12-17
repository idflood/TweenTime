d3 = require 'd3'

class KeysPreview
  constructor: (@timeline, @container) ->

  render: (bar) =>
    self = this
    tweenTime = self.timeline.tweenTime

    propVal = (d,i) -> if d.properties then d.properties else []
    propKey = (d) -> d.name

    properties = bar.selectAll('.keys-preview').data(propVal, propKey)

    subGrp = properties.enter()
      .append('svg')
      .attr("class", 'keys-preview timeline__right-mask')
      .attr('width', window.innerWidth - self.timeline.label_position_x)
      .attr('height', self.timeline.lineHeight)

    setItemStyle = (d) ->
      item = d3.select(this.parentNode.parentNode)
      bar_data = item.datum()
      if bar_data.collapsed == true then return ""
      # Show only when item is collapsed
      return "display: none;"

    properties.selectAll('.key--preview')
      .attr("style", setItemStyle)

    keyValue = (d,i,j) -> d.keys
    keyKey = (d, k) -> d.time
    keys = properties.selectAll('.key--preview').data(keyValue, keyKey)

    key_item = keys.enter()
      .append('path')
      .attr('class', 'key--preview')
      .attr("style", setItemStyle)
      .attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0')

    keys.attr('transform', (d) ->
        dx = self.timeline.x(d.time * 1000)
        dx = parseInt(dx, 10)
        dy = 11
        return "translate(" + dx + "," + dy + ")"
      )

    keys.exit().remove()

module.exports = KeysPreview
