const Store = require('../src/Store')

const store = new Store({
  name: 'store',
})

// name
store.observe('name', (newVal, oldVal) => {
  console.log(`The "name" new value is: ${newVal}, old value is ${oldVal}`)
})

store.data.name = 'awesome observable store'

// keyword
store.setObservableState('keyword')

store.observe('keyword', (newVal, oldVal) => {
  console.log(`The "keyword" new value is: ${newVal}, old value is ${oldVal}`)
})

store.data.keyword = ['observable', 'store']
