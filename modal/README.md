# Modal

## 概述

模态框组件

## 特性

- 自定义显示隐藏动画
- 控制点击遮罩是否隐藏
- 确认取消回调
- 自定义确认取消按钮文字

## 用法

引入资源

实例化组件对象

```javascript
var modal = new Modal({
  title: '',
  content: '',
  animation: {
    enter: 'fadeInDown',
    leave: 'fadeOutUp'
  },
  maskClosable: true,
  confirmText: 'yes',
  cancelText: 'no'
})

modal.on('confirm', function () {
  console.log("confirm")
})

modal.on('cancel', function () {
  console.log("cancel")
})

BUTTON.addEventListener('click', function () {
  modal.show('这里是一些内容')
})
```

## options

| item | type | default | desc |
| --- | --- | --- | --- |
| title | string | '标题' | 自定义标题 |
| content | string / htmlStr / element | '内容' | 自定义内容 |
| animation: { enter, leave } | object | animation: { enter, leave } | 自定义显示隐藏动画 |
| maskClosable | boolean | true | 遮罩层是否可点击隐藏 |
| confirmText | string | '确认' | 自定义确认按钮文字 |
| cancelText | string | '取消' | 自定义取消按钮文字 |

## 实例属性和方法

**on(event, callback)**

event:
- confirm
- cancel

`confirm` 事件在点击确认按钮时触发，`cancel` 事件在点击取消按钮时触发

**show(content)**

content: string / htmlStr / element

显示模态框

**hide()**

隐藏模态框

## 其它说明

依赖 [Emitter.js](https://github.com/winwangqi/event-emitter) 和 [Animate.css](https://daneden.github.io/animate.css/)
