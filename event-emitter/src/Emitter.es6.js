class Emitter {
  constructor() {
    this._eventsCount = 0
    this._events = {}

    Object.assign(Emitter.prototype, {
      on: Emitter._addEventListener,
      addListener: Emitter._addEventListener,
      off: Emitter._removeEventListener,
      removeListener: Emitter._removeEventListener,
      emit: Emitter._dispatchEvent,
      dispatchEvent: Emitter._dispatchEvent,
    })
  }

  /**
   * @description add event listener
   * @param {string} eventName
   * @param {function} listener
   * @return {object} this
   */
  static _addEventListener(eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    const events = this._events

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
  static _removeEventListener(eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    const listeners = this._events[eventName]
    let found = false

    if (!listeners) return this

    for (let i = listeners.length - 1; i > -1; i--) {
      const _listener = listeners[i]

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
  static _dispatchEvent(eventName) {
    const events = this._events
    const listeners = events[eventName]

    if (!listeners) return this

    const args = Array.prototype.slice.call(arguments, 1)
    const pos = []

    for (let i = 0, len = listeners.length; i < len; i++) {
      const _listener = listeners[i]

      if (typeof _listener === 'function') {
        _listener.apply(this, args)
      } else {
        _listener.listener.apply(this, args)
        pos.push(i)
      }
    }

    for (let i = 0, len = pos.length; i < len; i++) {
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
  once(eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" must be [Function]')

    const events = this._events

    if (!events[eventName]) {
      events[eventName] = []
      this._eventsCount += 1
    }

    events[eventName].push({ listener: listener })

    return this
  }
}
