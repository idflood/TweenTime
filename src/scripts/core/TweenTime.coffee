define (require) ->
  _ = require 'lodash'
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

    getTotalDuration: () => return @orchestrator.getTotalDuration()
