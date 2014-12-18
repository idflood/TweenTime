d3 = require 'd3'
Signals = require 'js-signals'
Utils = require '../core/Utils'
_ = require 'lodash'

class Keys
  constructor: (@timeline) ->
    #@selectionManager = @timeline.editor.selectionManager
    @onKeyUpdated = new Signals.Signal()

  selectNewKey: (data, container) ->
    self = this
    key = d3.select(container).selectAll('.key').filter((item) ->
      return item.time == data.time
    )
    if key.length
      d3.selectAll('.key--selected').classed('key--selected', false)
      key.classed('key--selected', true)
      key = key[0][0]
      self.timeline.selectionManager.select(key)

  render: (properties) ->
    self = this
    tweenTime = self.timeline.tweenTime

    dragmove = (d) ->
      sourceEvent = d3.event.sourceEvent
      propertyObject = this.parentNode
      lineObject = propertyObject.parentNode.parentNode
      propertyData = d3.select(propertyObject).datum()
      lineData = d3.select(lineObject).datum()

      currentDomainStart = self.timeline.x.domain()[0]
      mouse = d3.mouse(this)
      old_time = d.time
      dx = self.timeline.x.invert(mouse[0])
      dx = dx.getTime()
      dx = dx / 1000 - currentDomainStart / 1000
      dx = d.time + dx

      selection = self.timeline.selectionManager.getSelection()
      selection_first_time = false
      selection_last_time = false
      if selection.length
        selection_first_time = d3.select(selection[0]).datum().time
        selection_last_time = d3.select(selection[selection.length - 1]).datum().time
      selection = _.filter(selection, (item) => item.isEqualNode(this) == false)

      timeMatch = false
      if sourceEvent.shiftKey
        timeMatch = Utils.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer)
      if timeMatch == false
        timeMatch = dx

      d.time = timeMatch
      # Sort the keys of the current selected item.
      propertyData.keys = Utils.sortKeys(propertyData.keys)
      time_offset = d.time - old_time


      updateKeyItem = (item) ->
        itemPropertyObject = item.parentNode
        itemPropertyData = d3.select(itemPropertyObject).datum()
        itemLineObject = itemPropertyObject.parentNode.parentNode
        itemLineData = d3.select(itemLineObject).datum()
        itemLineData._isDirty = true
        itemPropertyData.keys = Utils.sortKeys(itemPropertyData.keys)

      key_scale = false
      is_first = false
      if selection.length
        if sourceEvent.altKey && selection_first_time? && selection_last_time?
          # keys scaling.
          is_first = selection_first_time == old_time
          if is_first
            key_scale = (selection_last_time - d.time) / (selection_last_time - old_time)
          else
            key_scale = (d.time - selection_first_time) / (old_time - selection_first_time)

        for item in selection
          data = d3.select(item).datum()
          if key_scale == false
            data.time += time_offset
          else
            if is_first
              data.time = selection_last_time - (selection_last_time - data.time) * key_scale
            else
              data.time = selection_first_time + (data.time - selection_first_time) * key_scale
          updateKeyItem(item)

      lineData._isDirty = true
      self.onKeyUpdated.dispatch()

    propValue = (d,i,j) -> d.keys
    propKey = (d, k) ->
      # Add a unique id for SelectionManager.removeDuplicates
      # and use it as key.
      if !d._id then d._id = Utils.guid()
      return d._id
    keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey)

    # selectKey is triggered by dragstart event
    selectKey = (d) ->
      event = d3.event
      # with dragstart event the mousevent is is inside the event.sourcEvent
      if event.sourceEvent then event = event.sourceEvent

      addToSelection = event.shiftKey
      # if element is already selectionned and we are on
      # the dragstart event, we stop there since it is already selected.
      if d3.event.type && d3.event.type == "dragstart"
        if d3.select(this).classed('key--selected')
          return

      self.timeline.selectionManager.select(this, addToSelection)

    dragend = (d) =>
      self.timeline.editor.undoManager.addState()

    drag = d3.behavior.drag()
      .origin((d) -> return d;)
      .on("drag", dragmove)
      .on("dragstart", selectKey)
      .on("dragend", dragend)

    key_grp = keys.enter()
      .append('g')
      .attr('class', 'key')
      # Use the unique id added in propKey above for the dom element id.
      .attr('id', (d) -> d._id)
      .on('mousedown', () ->
        # Don't trigger mousedown on linescontainer else
        # it create the selection rectangle
        d3.event.stopPropagation()
      )
      .call(drag)

    properties.selectAll('.key')

      .attr('class', (d) ->
        cls = 'key'
        # keep selected class
        if d3.select(this).classed('key--selected')
          cls += " key--selected"
        if d.ease
          ease = d.ease.split('.')
          if ease.length == 2
            cls += " " + ease[1]
        else
          # If no easing specified, the it's the default Quad.easeOut
          cls += ' easeOut'
        return cls
      )

    grp_linear = key_grp.append('g')
      .attr('class', 'ease-linear')
    grp_linear.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6')
    grp_linear.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L -6 0 L 0 6')

    grp_in = key_grp.append('g')
      .attr('class', 'ease-in')
    grp_in.append('path')
      .attr('class', 'key__shape-rect')
      .attr('d', 'M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5')
    grp_in.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L -6 0 L 0 6')

    grp_out = key_grp.append('g')
      .attr('class', 'ease-out')
    grp_out.append('path')
      .attr('class', 'key__shape-rect')
      .attr('d', 'M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5')
    grp_out.append('path')
      .attr('class', 'key__shape-arrow')
      .attr('d', 'M 0 -6 L 6 0 L 0 6')

    grp_inout = key_grp.append('g')
      .attr('class', 'ease-inout')
    grp_inout.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)

    keys.attr 'transform', (d) ->
      dx = self.timeline.x(d.time * 1000)
      dx = parseInt(dx, 10)
      dy = 10
      return "translate(" + dx + "," + dy + ")"

    keys.exit().remove()

module.exports = Keys
