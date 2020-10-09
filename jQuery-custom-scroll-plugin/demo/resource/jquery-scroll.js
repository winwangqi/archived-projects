// 自执行函数
(function (win, doc, $) {
    // 构造函数
    function CusScrollBar(options) {
        this._init(options);
    }

    // 为CusScrollBar的原型添加属性和方法
    $.extend(CusScrollBar.prototype, {
        _init: function (options) {
            this.options = {
                scrollDir: 'y',	    // 滚动的方向
                contSelector: '',	// 滚动内容区选择器
                barSelector: '',	// 滚动条选择器
                sliderSelector: '',	// 滚动滑块选择器
                tabItemSelector: '.tab-item',   // 标签选择器
                tabActiveClass: 'tab-active',   // 标签选中类名
                anchorSelector: '.anchor',  // 锚点选择器
                articleSelector: '.article',    // 文章选择器
                wheelStep: 80,      // 滚轮滚动步长
                animate: true,      // 是否开启平缓动画
                duration: 250,
                paddingArticle: true      // 是否补足最后文章
            };
            // 深拷贝，把options中的属性和方法拷贝进this.options
            $.extend(true, this.options, options || {});

            var opts = this.options;
            this.$doc = $(doc);
            // 滚动方向
            this.dir = this.options.scrollDir.toLowerCase();
            // 滚动内容区对象，必填项
            this.$cont = $(opts.contSelector);
            // 滚动条滑块对象，必填项
            this.$slider = $(opts.sliderSelector);
            // 滚动条对象
            this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
            // 标签
            this.$tabItem = $(opts.tabItemSelector);
            // 锚点项
            this.$anchor = $(opts.anchorSelector);
            // 文章对象
            this.$article = $(opts.articleSelector);

            this._computeSliderLength();
            this._initDomEvent();
        },
        /**
         * 计算滑块的高度（宽度）和位置
         * @private
         */
        _computeSliderLength: function () {
            if (this.dir === 'y') {
                this.$bar.removeClass('scroll-bar-x').addClass('scroll-bar-y');
                this.$slider.removeClass('scroll-slider-x').addClass('scroll-slider-y');

                var contClientHeight = this.$cont.height();
                var contTotalHeight = this.$cont[0].scrollHeight;
                var barHeight = this.$bar.height();
                this.$slider.height(barHeight * contClientHeight / contTotalHeight);
                if (this.$slider.height() >= barHeight) {
                    this.$bar.css('display', 'none');
                }
            } else if (this.dir === 'x') {
                this.$bar.removeClass('scroll-bar-y').addClass('scroll-bar-x');
                this.$slider.removeClass('scroll-slider-y').addClass('scroll-slider-x');

                var contClientWidth = this.$cont.parent().width();
                var contTotalWidth = this.$cont[0].scrollWidth;
                var barWidth = this.$bar.width();
                this.$slider.width(barWidth * contClientWidth / contTotalWidth);
                if (this.$slider.width() >= barWidth) {
                    this.$bar.css('display', 'none');
                }
            }
        },
        /**
         * 初始化DOM引用
         * @private
         */
        _initDomEvent: function () {
            this._initSliderDragEvent()
                ._bindContScroll()
                ._bindMousewheel()
                ._initTabEvent()
                ._paddingArticle();
        },
        /**
         * 初始化滑块拖动功能
         * @returns {CusScrollBar}
         * @private
         */
        _initSliderDragEvent: function () {
            var slider = this.$slider,
                sliderEl = slider[0],
                _this = this,
                isDown = false;     // 鼠标是否处于按下状态
            if (sliderEl) {
                var doc = this.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContBarRate;

                function mousemoveHandler(e) {
                    e.preventDefault();
                    if (dragStartPagePosition == null) {
                        return;
                    }
                    _this.scrollTo(dragStartScrollPosition + ((_this.dir === 'y' ? e.pageY : e.pageX) - dragStartPagePosition) * dragContBarRate, true);
                }

                slider.on('mousedown', function (e) {
                    e.preventDefault();
                    isDown = true;
                    dragStartPagePosition = _this.dir === 'y' ? e.pageY : e.pageX;
                    dragStartScrollPosition = _this.dir === 'y' ? _this.$cont[0].scrollTop : _this.$cont[0].scrollLeft;
                    dragContBarRate = _this.getMaxScrollPosition() / _this.getMaxSliderPosition();

                    doc.on('mousemove.scroll', mousemoveHandler)
                        .on('mouseup.scroll', function (e) {
                            doc.off('.scroll');
                            _this.$cont.stop(true, true);
                            _this.$bar.removeClass('scroll-bar-hover');
                            isDown = false;
                        });
                });

                // 控制滚动条和滑块的样式
                this.$bar.on('mouseover', function () {
                    $(this).addClass('scroll-bar-hover');
                }).on('mouseout', function () {
                    if (!isDown) {
                        _this.$bar.removeClass('scroll-bar-hover');
                    }
                })
            }
            return this;
        },
        // 内容可滚动的长度
        getMaxScrollPosition: function () {
            if (this.dir === 'y') {
                return Math.max(this.$cont.height(), this.$cont[0].scrollHeight - this.$cont.height());
            } else {
                return Math.max(this.$cont.width(), this.$cont[0].scrollWidth - this.$cont.width());
            }
        },
        // 滑块可滚动的长度
        getMaxSliderPosition: function () {
            if (this.dir === 'y') {
                return this.$bar.height() - this.$slider.height();
            } else if (this.dir === 'x') {
                return this.$bar.width() - this.$slider.width();
            }
        },
        // 内容区滚动的位置
        scrollTo: function (positionVal, isDrag) {
            var _this = this;
            var flag = isDrag && true;
            var posArr = this.getAllAnchorPosition();

            function getIndex (positionVal) {
                for (var i = posArr.length - 1; i >= 0; i--) {
                    if (positionVal >= posArr[i]) {
                        return i;
                    }
                }
            }
            if (posArr.length === this.$tabItem.length) {
                this.changeTabSelect(getIndex(positionVal));
            }
            if (this.dir === 'y') {
                this.$cont.stop(true, flag).animate({
                    scrollTop: positionVal
                }, {
                    duration: _this.options.animate ? _this.options.duration : 0,
                    easing: 'linear'
                });
            } else {
                this.$cont.stop(true, flag).animate({
                    scrollLeft: positionVal
                }, {
                    duration: _this.options.animate ? _this.options.duration : 0,
                    easing: 'linear'
                });
            }
        },
        // 监听内容滚动，同步滑块的位置
        _bindContScroll: function () {
            var _this = this;
            this.$cont.on('scroll', function () {
                _this.$slider.css(_this.dir === 'y' ? 'top' : 'left', _this.getSliderPosition());
            });
            return this;
        },
        // 计算滑块的相对位置
        getSliderPosition: function () {
            var maxSliderPosition = this.getMaxSliderPosition();
            if (this.dir === 'y') {
                return Math.min(maxSliderPosition, maxSliderPosition * this.$cont[0].scrollTop / this.getMaxScrollPosition());
            } else {
                return Math.min(maxSliderPosition, maxSliderPosition * this.$cont[0].scrollLeft / this.getMaxScrollPosition());
            }
        },
        // 绑定鼠标滚轮事件
        _bindMousewheel: function () {
            var _this = this;
            this.$cont.on('mousewheel DOMMouseScroll', function (e) {
                e.preventDefault();
                var oEv = e.originalEvent,
                    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oEv.detail || 0) / 3;
                _this.scrollTo((_this.dir === 'y' ? _this.$cont[0].scrollTop : _this.$cont[0].scrollLeft) + wheelRange * _this.options.wheelStep);
            });
            return this;
        },
        // 初始化标签切换功能
        _initTabEvent: function () {
            var _this = this;
            this.$tabItem.on('click', function (e) {
                e.preventDefault();
                var index = $(this).index();
                _this.changeTabSelect(index);
                // 点击标签跳到对应位置
                if (_this.dir === 'y') {
                    _this.scrollTo(_this.$cont[0].scrollTop + _this.getAnchorPosition(index));
                } else {
                    _this.scrollTo(_this.$cont[0].scrollLeft + _this.getAnchorPosition(index));
                }
            });
            return this;
        },
        // 切换标签的选中
        changeTabSelect: function (index) {
            var active = this.options.tabActiveClass;
            return this.$tabItem.eq(index).addClass(active)
                .siblings().removeClass(active);
        },
        // 获取锚点距上边界的距离
        getAnchorPosition: function (index) {
            if (this.dir === 'y') {
                return this.$anchor.eq(index).position().top;
            } else {
                return this.$anchor.eq(index).position().left;
            }
        },
        // 获取所有锚点的位置
        getAllAnchorPosition: function () {
            var _this = this;
            var allPositionArr = [];
            if (this.dir === 'y') {
                $.each(this.$anchor, function (index) {
                    allPositionArr.push(_this.$cont[0].scrollTop + _this.getAnchorPosition(index));
                });
            } else {
                $.each(this.$anchor, function (index) {
                    allPositionArr.push(_this.$cont[0].scrollLeft + _this.getAnchorPosition(index));
                });
            }
            return allPositionArr;
        },
        // 补足最后文章
        _paddingArticle: function () {
            if (this.options.paddingArticle) {
                var $lastArticle = this.$article.last();
                var $div = $("<div></div>");

                if (this.dir === 'y') {
                    var lastArticleHeight = $lastArticle.height();
                    var contHeight = this.$cont.height();

                    if (lastArticleHeight < contHeight) {
                        $div.height(contHeight - lastArticleHeight);
                    }
                    $lastArticle.after($div);
                } else {
                    var lastArticleWidth = $lastArticle.width();
                    var contWidth = this.$cont.width();

                    if (lastArticleWidth < contWidth) {
                        $div.height(contWidth - lastArticleWidth);
                    }
                    $lastArticle.after($div);
                }
            }
            return this;
        }
    });

    $.CusScrollBar = CusScrollBar;
})(window, document, jQuery);
