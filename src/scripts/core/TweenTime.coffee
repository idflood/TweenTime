define (require) ->
  Timer = require 'cs!core/Timer'
  Orchestrator = require 'cs!core/Orchestrator'

  class TweenTime
    constructor: (@data) ->
      @timer = new Timer()
      @orchestrator = new Orchestrator(@timer, @data)

    getTotalDuration: () => return @orchestrator.getTotalDuration()

    isUpdating: () => return @orchestrator.updating