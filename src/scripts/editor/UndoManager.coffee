define (require) ->
  class UndoManager
    constructor: (@editor) ->
      @history_max = 100
      @history = []
      @current_index = 0
      # Add the initial state
      @addState()

    undo: () =>
      # If there is no more history return
      if @current_index <= 0 then return false

    redo: () =>
      # Stop if there is no more things.
      if @current_index >= @history.length - 1 then return false

    addState: () =>
      data = @editor.exporter.getData()
      @history.push(data)

      # Keep history to a max size by removing the first element if needed.
      if @history.length > @history_max then @history.shift()

      # Set the current index
      @current_index = @history.length - 1