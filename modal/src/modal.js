(function (doc, win) {
  var template =
    '<div class="modal">\
      <div class="modal-mask animated"></div>\
      <div class="modal-wrap animated">\
        <div class="modal-head"></div>\
        <div class="modal-body"></div>\
        <div class="modal-foot">\
          <a href="javascript:;" class="confirm"></a>\
          <a href="javascript:;" class="cancel"></a>\
        </div>\
      </div>\
    </div>';
  
  var CLS = {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    fadeInDown: 'fadeInDown',
    fadeOutUp: 'fadeOutUp'
  }

  var DEFAULT = {
    title: '标题',
    content: '内容',
    confirmText: '确认',
    cancelText: '取消',
    animation: {
      enter: CLS.fadeInDown,
      leave: CLS.fadeOutUp
    },
    maskClosable: true
  }

  var helper = {
    /**
     * 将 HTML 字符串转换为节点
     */
    html2node: function (str) {
      var node = doc.createElement('div')
      node.innerHTML = str
      return node.children[0]
    },

    /**
     * 扩展对象属性
     * extent({ a: 1 }, { a: 2, b: 1 }) => { a: 1, b: 1 }
     */
    extend: function (o1, o2, deep) {
      for (var k in o2) {
        var type = typeof o1[k]

        if (type === 'object' && deep) {
          this.extend(o1[k], o2[k])
        } else if (type === 'undefined') {
          o1[k] = o2[k]
        }
      }
      return o1
    },

    /**
     * 判断对象是否是节点
     */
    isElement: function (o) {
      if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
        return true
      } else {
        return (o && o.nodeType && o.nodeType === 1) ? true : false
      }
    },

    /**
     * querySelector 简写
     */
    qs: function (selector, context) {
      context = context || doc
      return context.querySelector(selector)
    },

    /**
     * querySelectorAll 简写
     */
    qsa: function (selector, context) {
      context = context || doc
      return context.querySelectorAll(selector)
    }
  }

  var Modal = function (options) {
    options = options || {}

    // div.modal 节点
    this.containerEl = this._layout.cloneNode(true)
    // 遮罩
    this.maskEl = helper.qs('.modal-mask', this.containerEl)
    // 窗体节点，用于动画
    this.wrapEl = helper.qs('.modal-wrap', this.containerEl)
    // head 用户自定义标题
    this.headEl = helper.qs('.modal-head', this.containerEl)
    // body 用于插入自定义内容
    this.bodyEl = helper.qs('.modal-body', this.containerEl)
    // 确认按钮
    this.confirmBtnEl = helper.qs('.confirm', this.containerEl)
    // 取消按钮
    this.cancelBtnEl = helper.qs('.cancel', this.containerEl)

    // 将 options 扩展到实例
    helper.extend(this, options)

    this._init()

    this._initEvent()
  }

  helper.extend(Modal.prototype, {
    _layout: helper.html2node(template),

    _init: function () {
      helper.extend(this, DEFAULT, true)

      // 设置标题
      this.headEl.innerText = this.title
      // 设置内容
      this.setContent(this.content)
      // 设置按钮文字
      this.confirmBtnEl.innerText = this.confirmText
      this.cancelBtnEl.innerText = this.cancelText
    },

    _initEvent: function () {
      this.confirmBtnEl && this.confirmBtnEl.addEventListener(
        'click', this._onConfirm.bind(this)
      )

      this.cancelBtnEl && this.cancelBtnEl.addEventListener(
        'click', this._onCancel.bind(this)
      )

      this.maskClosable && this.maskEl.addEventListener(
        'click', this.hide.bind(this)
      )
    },

    _onConfirm: function () {
      this.emit('confirm')
      this.hide()
    },

    _onCancel: function () {
      this.emit('cancel')
      this.hide()
    },

    /**
     * 设置内容
     */
    setContent: function (content) {
      var contentType = typeof content
      var contentNode = null

      if (contentType === 'string') {
        contentNode = helper.html2node(content)
        if (!contentNode) {
          contentNode = doc.createElement('span')
          contentNode.innerText = content
        }
      } else if (helper.isElement(content)) {
        contentNode = content
      }
      var bodyChildEl = this.bodyEl.children[0]
      bodyChildEl && this.bodyEl.removeChild(bodyChildEl)
      this.bodyEl.appendChild(contentNode)
    },

    /**
     * 显示弹窗
     */
    show: function (content) {
      content && this.setContent(content)
      document.body.appendChild(this.containerEl)

      animateClass(this.maskEl, CLS.fadeIn)
      this.showAnimation = animateClass(this.wrapEl, this.animation.enter)
    },

    /**
     * 隐藏弹窗
     */
    hide: function () {
      if (!this.showAnimation.completed) return
      if (this.hideAnimation && !this.hideAnimation.completed) return
      var self = this

      animateClass(this.maskEl, CLS.fadeOut)
      this.hideAnimation = animateClass(this.wrapEl, this.animation.leave, function () {
        document.body.removeChild(self.containerEl)
      })
    }
  })

  helper.extend(Modal.prototype, new Emitter())

  /*************
   * export
   ************/
  if (typeof exports === 'object') {
    // commonJS
    module.exports = Modal
  } else if (typeof define === 'fucntion' && define.amd) {
    // amd
    define(function () {
      return Modal
    })
  } else {
    window.Modal = Modal
  }
})(document, window)