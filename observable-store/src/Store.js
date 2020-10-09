const Emitter = require('../lib/Emitter.es6')

class Store extends Emitter {
  constructor(state) {
    super()

    this._init(state)
    this._defineReactive(state)
    this._extendPrototype()
  }

  _init() {
    // private state store
    this._data = {}
    // keys observable store
    this.data = {}
  }

  _defineReactive(state) {
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        this._set(key, state[key])
      }
    }
  }

  _extendPrototype() {
    Object.assign(Store.prototype, {
      /**
       * setObservableState(key: string, initState: any)
       */
      setObservableState: this._set,
      /**
       * observe(key: string, observer: function)
       */
      observe: this.on
    })
  }

  /**
   * 
   * @param {string} key 
   * @param {angy} initState 
   */
  _set(key, initState) {
    if (this.data[key]) throw new Error(`data has own property::${key}, cannot set new observable value.`)

    const self = this

    this._data[key] = initState

    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: false,
      set(newValue) {
        const oldValue = self._data[key]

        if (newValue === oldValue) return

        self._data[key] = newValue
        self.emit(key, newValue, oldValue)
      },
      get() {
        return self._data[key]
      }
    })
  }

  /**
   * serialize object
   */
  serialize() {
    return JSON.stringify(this._data)
  }
}

module.exports = Store