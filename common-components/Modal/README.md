# 模态框

## 概述

在许多场景下，为了聚焦用户注意力，会采用模态框得形式来展示一些重要的内容。

为了应对这种需求而专门编写的一个模态框插件。

灵感来源于 Bootstrap Modal

## 特点

- 依照特定的 HTML 结构书写模态框结构即可正常运行

- 可通过编程式来控制模态框的显隐

- 不兼容低版本浏览器

## 用法

### 基本用法

1. 按照以下结构书写模态框的 HTML 结构代码，并书写在文档的最高层级

1. 添加关联按钮，按钮的 `data-toggle` 属性必须为 `modal`，`data-target` 为指向模态框的选择器

1. 在模态框 HTML 结构内具有 `data-dismiss="modal` 属性的按钮为模态框关闭按钮

HTML
```html
<button type="button" data-toggle="modal" data-target="#example-modal">Open modal</button>

<div id="example-modal" class="modal" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">This is modal body.</div>
      <button type="button" data-dismiss="modal">Close modal</button>
    </div>
  </div>
</div>
```

### 编程式用法

1. 必须在文档加载完成之后才可获取到 `Modal` 构造函数

1. 构造函数支持两种传参方式
    1. 对象，`modalSelector` 属性为模态框唯一选择器，`backdrop` 属性为点击遮罩层是否隐藏模态框；
    1. 字符串，字符串为模态框选择器；

1. 手动关闭模态框可调用模态框对象的 `hide` 方法，即 `myModal.hide()`

HTML
```html
<button id="close-modal-btn" type="button">Open modal</button>

<div id="example-modal" class="modal" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">This is modal body.</div>
      <button type="button" data-dismiss="modal">Close modal</button>
    </div>
  </div>
</div>
```

JS
```javascript
window.addEventListener('click', () => {
  const myModal = new Modal({ modalSelector: '#example-modal' });
  document.querySelector('#close-modal-btn').addEventListener('click', myModal.show.bind(myModal), false);
}, false);
```

## 特别说明

### 模态框的 HTML 代码放置的位置

务必将模态框的 HTML 代码放在文档的最高层级内（也就是说，尽量作为 body 标签的直接子元素），以避免其他组件影响模态框的展现和/或功能。

> 作者：王琦 / 日期：2017.08.10