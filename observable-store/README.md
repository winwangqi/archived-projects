# observable store

## 概述

可观测的 store，服务于响应式编程。

## 用法

```javascript
// create store
var store = new Store({
  key: 'value',
  obj: {
    subkey: 'subvalue',
  },
  arr: ['a', 'b', 'c']
})

// get state from store
var key = store.data.key

// subscribe state update
store.observe('key', (newVal, oldVal) => {
  // do something...
})

// update state
store.data.key = 'new value'

// add new state
store.setObservableState('newkey', 'initial state')

// ** reference type need new reference
store.data.obj = {
  ...store.data.obj,
  subkey: 'new subvalue',
}
store.data.arr = [].concat(arr.push('d'))
```

## 实例属性和方法

### **store.observe(key, observer)**

store 的值更新监听函数

### **store.setObservableState(key, initState)**

store 实例化后，添加新的可观测属性
