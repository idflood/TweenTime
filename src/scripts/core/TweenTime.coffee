define (require) ->
  _ = require 'lodash'
  Utils = require 'cs!core/Utils'
  Timer = require 'cs!core/Timer'
  Orchestrator = require 'cs!core/Orchestrator'

  class TweenTime
    constructor: (@data) ->
      @timer = new Timer()
      @orchestrator = new Orchestrator(@timer, @data)

    getItem: (item_id) =>
      # In case we passed the item object directly return it.
      if item_id != null && typeof item_id == 'object'
        return item_id

      return _.find(@data, (item) -> item.id == item_id)

    getProperty: (prop_name, item_id_or_obj) =>
      # If we passed the item name get the object from it.
      item_id_or_obj = @getItem(item_id_or_obj)

      # Return false if we have no item
      if !item_id_or_obj then return false

      return _.find(item_id_or_obj.properties, (property) ->
        return property.name == prop_name
      )

    getValues: (item_id_or_obj) =>
      # If we passed the item name get the object from it.
      item_id_or_obj = @getItem(item_id_or_obj)

      # Return false if we have no item
      if !item_id_or_obj then return undefined

      return item_id_or_obj.values

    getValue: (prop_name, item_id_or_obj) =>
      # If we passed the item name get the object from it.
      values = @getValues(item_id_or_obj)

      # Return false if we have no item
      if !values then return undefined

      if values[prop_name]? then return values[prop_name] else return undefined

    getKeyAt: (property, time_in_seconds) =>
      return _.find(property.keys, (key) ->
        return key.time == time_in_seconds
      )

    setValue: (property, new_val, time_in_seconds = false) =>
      if time_in_seconds == false then time_in_seconds = @timer.getCurrentTime() / 1000
      key = @getKeyAt(property, time_in_seconds)

      if key
        # If we found a key, simply update the value.
        key.val = new_val
      else
        # If no key, create it and add it to the array.
        key = {val: new_val, time: time_in_seconds}
        property.keys.push(key)
        # Also sort the keys.
        property.keys = Utils.sortKeys(property.keys)

    getTotalDuration: () => return @orchestrator.getTotalDuration()
