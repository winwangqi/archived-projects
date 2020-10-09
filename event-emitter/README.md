# Emitter

## 概述

发布-订阅模式的实现，解耦代码，简化逻辑。

## 特点

- api 简单
- 链式调用

## 用法

```javascript
var emitter = new Emitter();

emitter
  .on('eventA', fnA)
  .on('eventB', fnB)
  .once('eventC', fnC)
  .off('eventB', fnB)
  .emit('eventA', args)
```

## 实例属性和方法

### **emitter.on(eventName, listener)**

别名：emitter.addListener(evenetName, listener)

事件注册函数，listener 为匿名函数时无法移除

### **emitter.once(eventName, listener)**

事件注册函数，只会执行一次

### **emitter.off(eventName, listener)**

别名：emitter.removeListener(evenetName, listener)

事件移除函数，无法移除匿名函数

### **emitter.emit(eventName[, ...args])**

别名：emitter.dispatchEvent(evenetName[, ...args])

事件分发函数，支持传入多个参数
