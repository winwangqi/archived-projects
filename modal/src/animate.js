!function () {
  var transitionEnd = 'transitionend',
      animationEnd = 'animationend',
      transitionProperty = 'transition',
      animationProperty = 'animation'

  var addClass = function (node, className) {
    var currentClassName = node.className || ''
    if ((' ' + currentClassName + ' ').indexOf(' ' + className + ' ') === -1) {
      node.className = currentClassName ? (currentClassName + ' ' + className) : className
    }
  }

  var removeClass = function (node, className) {
    var currentClassName = node.className || ''
    node.className = (' ' + currentClassName + ' ').replace(' ' + className + ' ', ' ').trim()
  }

  var animateClass = function (node, className, callback) {
    var ret = { completed: false }

    var _onAnimateEnd = function (event) {

      /**
       * 说明：此处给 node 添加的 animationEnd & transitionEnd 事件会穿透给子元素，所以需要判断 target 是否与 node 相等
       */
      if (event && event.target !== node) return;

      removeClass(node, className)

      node.removeEventListener(animationEnd, _onAnimateEnd)
      node.removeEventListener(transitionEnd, _onAnimateEnd)

      ret.completed = true

      callback && callback()
    }

    addClass(node, className)

    node.addEventListener(animationEnd, _onAnimateEnd)
    node.addEventListener(transitionEnd, _onAnimateEnd)

    return ret
  }

  /*************
   * export
   ************/
  if (typeof exports === 'object') {
    // commonJS
    module.exports = animateClass
  } else if (typeof define === 'fucntion' && define.amd) {
    // amd
    define(function () {
      return animateClass
    })
  } else {
    window.animateClass = animateClass
  }
}()
