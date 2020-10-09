!function () {
  /**
   * @constructor Emitter
   */
  var Emitter = function () {
    this._eventsCount = 0
    this._events = {}
  }


  /**
   * @description add event listener
   * @param {string} eventName
   * @param {function} listener
   * @return {object} this
   */
  Emitter._addEventListener = function (eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    var events = this._events

    if (!events[eventName]) {
      events[eventName] = []
      this._eventsCount += 1
    }

    events[eventName].push(listener)

    return this
  }


  /**
   * @description remove event listener
   * @param {string} eventName
   * @param {function} listener
   * @return {object} this
   */
  Emitter._removeEventListener = function (eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    var listeners = this._events[eventName],
      i = 0,
      found = false

    if (!listeners) return this

    for (i = listeners.length - 1; i > -1; i--) {
      var _listener = listeners[i]

      if (typeof _listener === 'function') {
        if (_listener === listener) {
          found = true
          break
        }
      } else {
        if (_listener.listener === listener) {
          found = true
          break
        }
      }
    }

    if (found) {
      listeners.splice(i, 1)
      if (listeners.length === 0) {
        delete this._events[eventName]
        this._eventsCount -= 1
      }
    }

    return this
  }


  /**
   * @description dispatch event
   * @param {string} eventName
   * @return {object} this
   */
  Emitter._dispatchEvent = function (eventName) {
    var events = this._events
    var listeners = events[eventName]

    if (!listeners) return this

    var args = Array.prototype.slice.call(arguments, 1)
    var pos = []

    for (var i = 0, len = listeners.length; i < len; i++) {
      var _listener = listeners[i]

      if (typeof _listener === 'function') {
        _listener.apply(this, args)
      } else {
        _listener.listener.apply(this, args)
        pos.push(i)
      }
    }

    for (i = 0, len = pos.length; i < len; i++) {
      listeners.splice(pos[i] - i, 1)
    }

    return this
  }

  /**
   * @description add event listener that execute just once
   * @param {string} eventName
   * @param {function} listener
   * @return {object} this
   */
  Emitter.prototype.once = function (eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    var events = this._events

    if (!events[eventName]) {
      events[eventName] = []
      this._eventsCount += 1
    }

    events[eventName].push({ listener: listener })

    return this
  }


  Emitter.prototype.on = Emitter._addEventListener
  Emitter.prototype.addListener = Emitter._addEventListener

  Emitter.prototype.off = Emitter._removeEventListener
  Emitter.prototype.removeListener = Emitter._removeEventListener

  Emitter.prototype.emit = Emitter._dispatchEvent
  Emitter.prototype.dispatchEvent = Emitter._dispatchEvent


  /*************
   * export
   ************/
  if (typeof exports === 'object') {
    // commonJS
    module.exports = Emitter
  } else if (typeof define === 'fucntion' && define.amd) {
    // amd
    define(function () {
      return Emitter
    })
  } else {
    window.Emitter = Emitter
  }
}()