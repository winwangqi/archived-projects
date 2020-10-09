/**
 * ****************************************
 *           Carousel - 轮播图
 * =================
 * 作者: 王琦
 * 日期：2017/09/04
 * 版本：Ver 1.1
 * =================
 * change log:
 *  ver 1.0 (2017/09/01)
 *    - basic function
 *  ver 1.1 (2017/09/04)
 *    - 添加轮播图切换事件处理
 * =================
 * 用法：
 *    1.引入此文件
 *    2.实例化 Carousel 对象
 * 参数说明：
 *    1.viewportSelector
 *      | type: selector
 *      | required: true
 *      | desc: carousel 视口选择器
 *    2.carouselWrapperSelector
 *      | type: selector
 *      | required: true
 *      | desc: carousel item 包裹元素选择器
 *    3.carouselItemSelector
 *      | type: selector
 *      | required: true
 *      | desc: carousel item 选择器
 *    4.duration
 *      | type: number
 *      | unit: millisecond
 *      | required: false
 *      | default: 250
 *      | desc: carousel item 切换时间
 *    5.changePercent
 *      | type: float
 *      | unit: percent
 *      | required: false
 *      | default: 1 / 3
 *      | desc: 触发切换的滑动距离
 *    6.itemScale
 *      | type: float
 *      | required: false
 *      | default: 0.8
 *      | desc: carousel item css 属性 transform scale
 *    6.appendNum
 *      | type: number
 *      | required: false
 *      | default: 3
 *      | desc: 两边填充个数
 * 实例方法：
 *    1.on(type, callback)
 *      | type: 事件类型，目前支持的事件 [ 'change' ]
 *      |
 *      |
 *      |
 * ****************************************
 */

(function (win, doc) {
  var helper = {
    /**
     * querySelector
     * @param selector
     * @param context { default: document }
     * @return element
     */
    qs: function (selector, context) {
      var _context = context || doc;
      return _context.querySelector(selector);
    },

    /**
     * querySelectorAll
     * @param selector
     * @param context
     * @return nodeList
     */
    qsa: function (selector, context) {
      var _context = context || doc;
      return _context.querySelectorAll(selector);
    },

    /**
     * 
     * @param elem
     * @return translateX { type: number }
     */
    getComputedTranslateX: function (elem) {
      var style = window.getComputedStyle(elem);
      var matches = style.transform.match(/^matrix\((.+)\)$/);
      return matches ? +matches[1].split(', ')[4] : 0;
    },

    /**
     * 
     * @param option { type: object, shdow: { delay: 0, duration: 1(s), property: ['translate'], timingFunction: 'ease' } }
     */
    addTransition: function (option) {
      var delay = option.delay || 0;
      var duration = (typeof option.duration === 'number') ? option.duration : 1;
      var property = (typeof option.property === 'string') ? option.property : option.property.join(' ');
      var timingFunction = option.timingFunction || 'ease-out';
      option.elem.style.transition = duration + 's ' + delay + 's ' + property + ' ' + timingFunction;
    },

    removeTransition: function (elem) {
      elem.style.transition = '';
    },

    throttle: function (func, wait, options) {
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};

      var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };

      var throttled = function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };

      throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
      };

      return throttled;
    },

    setTransformScale: function (elem, scale) {
      elem.style.transform = 'scale(' + scale + ')';
    }
  };

  function Carousel(option) {
    this.init(option);

    this.state = {
      eventCallback: {
        change: []
      }
    };
  }

  Carousel.prototype = {
    constructor: Carousel,
    init: function (option) {
      this.option = option;
      // init variable
      this.curIdx = 0;
      this.originalTranslateX = 0;
      this.appendNum = option.appendNum || 3;
      this.initPos = 0;
      this.startPos = { clientX: 0, clientY: 0 };
      this.endPos = { clientX: 0, clientY: 0 };

      this.changePercent = option.changePercent || 1 / 3;
      this.duration = option.duration || 250;
      this.itemScale = option.itemScale || 0.8;

      // store element
      this.viewportElem = helper.qs(option.viewportSelector);
      this.carouselWrapperElem = helper.qs(option.carouselWrapperSelector);
      this.carouselItemElems = helper.qsa(option.carouselItemSelector, this.carouselWrapperElem);
      // calculate element length
      this._calcLength();
      // 
      this._initSetting();
      // bind event
      this._bindEvent();
    },

    _calcLength: function () {
      var itmSty = window.getComputedStyle(this.carouselItemElems[0]);
      this.carouselWrapperWidth = parseInt(window.getComputedStyle(this.viewportElem).width);
      this.carouselItemWidth = parseInt(itmSty.width);
      this.carouselItemGap = parseInt(itmSty.marginRight);
      this.carouselItemsLength = this.carouselItemElems.length;
    },

    _initSetting: function () {
      var self = this;
      
      var vpW = this.carouselWrapperWidth;
      var itmW = this.carouselItemWidth;
      var itmGap = this.carouselItemGap;
      var itmLen = this.carouselItemsLength;
      var appendNum = this.appendNum;

      var fstItmElem = this.carouselItemElems[0];
      var lstItmElem = this.carouselItemElems[itmLen - 1];

      for (var i = 0; i < appendNum; i++) {
        fstItmElem.parentNode.insertBefore(this.carouselItemElems[itmLen - (appendNum - i)].cloneNode(true), fstItmElem);
        lstItmElem.parentNode.appendChild(this.carouselItemElems[i].cloneNode(true));
      }

      // set wrapper width
      this.totalItemElems = helper.qsa(this.option.carouselItemSelector, this.carouselWrapperElem);
      this.carouselWrapperElem.style.width = (this.totalItemElems.length + 1) * (itmW + itmGap) + 'px';

      // initial locate positoin
      // -itmW + ((vpW - (itmW + itmGap * 2)) / 2)
      this.initPos = vpW / 2 - itmGap * appendNum - itmW * (0.5 + appendNum);
      this._locateCarousel(this.initPos);

      // set current item scale
      this._setCurItmScale();
    },

    _bindEvent: function () {
      this.throttledTouchmoveHandler = helper.throttle(this._touchmoveHandler, 15);
      // bind carouse wrapper touchstart event
      this.boundTouchstartHandler = this._touchstartHandler.bind(this);
      this.boundTouchmoveHandler = this.throttledTouchmoveHandler.bind(this);
      this.boundTouchendHandler = this._touchendHandler.bind(this);

      this.carouselWrapperElem.addEventListener('touchstart', this.boundTouchstartHandler, false);
      this.carouselWrapperElem.addEventListener('touchmove', this.boundTouchmoveHandler, false);
      this.carouselWrapperElem.addEventListener('touchend', this.boundTouchendHandler, false);
    },

    _touchstartHandler: function (e) {
      var touch = e.touches[0];
      this.startPos.clientX = touch.clientX;
      this.startPos.clientY = touch.clientY;

      this.originalTranslateX = helper.getComputedTranslateX(this.carouselWrapperElem);

      helper.removeTransition(this.carouselWrapperElem);
      this._locateCarousel(this.originalTranslateX);
    },

    _touchmoveHandler: function (e) {
      var touch = e.touches[0];
      this.endPos.clientX = touch.clientX;
      this.endPos.clientY = touch.clientY;

      var diffX = this.endPos.clientX - this.startPos.clientX;
      var diffY = this.endPos.clientY - this.startPos.clientY;

      var moveDir = this._moveDirCalc(diffX, diffY);

      if (moveDir === 'x') {
        this._locateCarousel(this.originalTranslateX + diffX);
      }
    },

    _touchendHandler: function (e) {
      // cancel throttle function
      this.throttledTouchmoveHandler.cancel();

      var touch = e.changedTouches[0];
      var distX = touch.clientX - this.startPos.clientX;

      var itemWidthPlusGap = this.carouselItemWidth + this.carouselItemGap;
      var itemLen = this.carouselItemsLength;

      if (Math.abs(distX) > this.carouselItemWidth * this.changePercent) {
        this.curIdx = distX > 0 ? this.curIdx + 1 : this.curIdx - 1;

        if (this.curIdx <= -itemLen) {
          // great than
          var curX = helper.getComputedTranslateX(this.carouselWrapperElem);
          var targetX = this.initPos + itemWidthPlusGap * this.curIdx;
          this._locateCarousel(this.initPos +  (curX - targetX));
          this.curIdx = 0;
        } else if (this.curIdx > 0) {
          // less than
          curX = helper.getComputedTranslateX(this.carouselWrapperElem);
          targetX = this.initPos + itemWidthPlusGap * this.curIdx;
          this.curIdx = 1 - itemLen;
          this._locateCarousel(this.initPos + this.curIdx * itemWidthPlusGap - (targetX - curX));
        }

        this.trigger('change', { curIdx: Math.abs(this.curIdx) });
      }

      // this._locateCarousel(this.initPos + itemWidthPlusGap * this.curIdx);

      // ※※ Browser Bug ? Anyway, must be have this statement ※※
      helper.getComputedTranslateX(this.carouselWrapperElem);
      // ※※※※※※

      helper.addTransition({ elem: this.carouselWrapperElem, duration: this.duration / 1000, property: 'transform' });
      this._locateCarousel(this.initPos + itemWidthPlusGap * this.curIdx);

      // set current item scale
      this._setCurItmScale();
    },

    _moveDirCalc: function (diffX, diffY) {
      return (Math.abs(diffX) - Math.abs(diffY)) > 0 ? 'x' : 'y';
    },

    _locateCarousel: function (position) {
      this.carouselWrapperElem.style.transform = 'translateX(' + position + 'px)';
    },

    _setCurItmScale: function () {
      var self = this;
      this.totalItemElems.forEach(function (itm, idx) {
        helper.setTransformScale(itm, self.itemScale );
      });

      helper.setTransformScale(this.totalItemElems[this.appendNum + Math.abs(this.curIdx)], 1);
    },

    /**
     * 注册事件
     */
    on: function (type, callback) {
      switch (type) {
        case 'change':
          this.state.eventCallback.change.push(callback);
          break;
        default:
          break;  
      }
    },

    /**
     * 触发事件
     */
    trigger: function (type, payload) {
      switch (type) {
        case 'change':
          this.state.eventCallback.change.map(function (callback) {
            callback({
              type: type,
              payload: { curIdx: payload.curIdx }
            })
          });  
          break;
        default:
          break;  
      }
    },

    /**
     * 销毁
     */
    destroy: function () {
      this.carouselWrapperElem.removeEventListener('touchstart', this.boundTouchstartHandler, false);
      this.carouselWrapperElem.removeEventListener('touchmove', this.boundTouchmoveHandler, false);
      this.carouselWrapperElem.removeEventListener('touchend', this.boundTouchendHandler, false);
      this.state.eventCallback.change.length = 0;
    }
  };

  // CommonJs
  if (typeof exports === 'object') {
    module.exports = Carousel;
  // AMD
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return Carousel;
    });
  // 直接暴露
  } else {
    if (win.Carousel) {
      throw new Error('Carousel has exist in window');
    } else {
      win.Carousel = Carousel;
    }
  }
  
})(window, document);
