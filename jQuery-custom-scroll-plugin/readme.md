# jQuery 自定义滚动条插件

## 概述

一个基于jQuery的自定义滚动条插件。可以通过传入**options**对象设置滚动方向、是否开启滚动动画，动画速度，鼠标滚动步长以及是否开启补足最后文章空白。

## API

|设置|参数|说明|
|---|---|---|
|scrollDir|selector:string|滚动方向，默认'y'|
|contSelector|selector:string|滚动内容区选择器|
|barSelector|selector:string|滚动条选择器|
|sliderSelector|selector:string|滚动滑块选择器|
|tabItemSelector|selector:string|标签选择器，默认'.tab-item'|
|tabActiveClass|class:string|标签选中类名，默认'tab-active'|
|anchorSelector|selector:string|锚点选择器|
|articleSelector|selector:string|文章选择器，默认'.article'|
|wheelStep|number|滚轮步长，默认200|
|animate|boolean|是否平缓滚动，默认开启|
|paddingArticle|boolean|最后文章补足一页时是否以空白补足，默认开启|
|duration|number|动画过渡时间，值越大，动画速度越慢，默认250|

## 用法

- html结构
```html
<!-- 示例容器 -->
<div class="scroll-demo">
    <!-- 标签切换区 -->
    <ul class="scroll-tab clearfix">
        <li class="tab-item tab-active">Article1</li>
        <li class="tab-item">Article2</li>
        <li class="tab-item">Article3</li>
        <li class="tab-item">Article4</li>
    </ul>
    <!-- 滚动内容区 -->
    <div class="scroll-wrap">
        <!-- 滚动内容 -->
        <div class="scroll-cont">
            <div class="article">...</div>
            <div class="article">...</div>
            <div class="article">...</div>
            <div class="article">...</div>
        </div>

        <!-- 滚动条 -->
        <div class="scroll-bar">
            <!-- 滚动滑块 -->
            <div class="scroll-slider"></div>
        </div>
    </div>
</div>
```

- css部分
```css
.scroll-demo {
    width: 540px;
    border: 1px solid #e5e5e5;
    background: #fff;
    margin: 30px auto;
}
/* 标签切换区域 */
.scroll-tab {
    height: 34px;
    border-bottom: 1px solid #e5e5e5;
    color: #666;
    background: #f8f8f8;
}
.scroll-tab .tab-item {
    float: left;
    height: 100%;
    font: 14px/34px "Microsoft Yahei";
    text-align: center;
    border-right: 1px solid #e5e5e5;
    padding: 0 20px;
    cursor: pointer;
}
.scroll-tab .tab-active {
    color: #00be3c;
    background: #fff;
    border-top: 2px solid #00be3c;
    margin: -1px 0;
}
/* 滚动内容区 */
.scroll-wrap {
    width: 100%;
    height: 300px;
    position: relative;
}
/* 滚动内容 */
.scroll-wrap .scroll-cont {
    height: 100%;
    padding: 0 15px;
    overflow: hidden;
}
/* 滚动条 */
.scroll-wrap .scroll-bar {
    position: absolute;
}
.scroll-wrap .scroll-bar-hover {
    background: #f6f6f6;
}
/* 滑块 */
.scroll-wrap .scroll-slider {
    position: absolute;
    border-radius: 9px;
    cursor: pointer;
    background: #E7E7E7;
}
.scroll-wrap .scroll-bar-hover .scroll-slider {
    background: #959595;
}
/* 滚动条-竖向 */
.scroll-wrap .scroll-bar-y {
    top: 0;
    right: 0;
    width: 14px;
    height: 100%;
}
/* 滑块-竖向 */
.scroll-wrap .scroll-slider-y {
    top: 0;
    left: 1px;
    width: 12px;
    height: 100%;
}
/* 滚动条-横向 */
.scroll-wrap .scroll-bar-x {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 14px;
}
/* 滑块-横向 */
.scroll-wrap .scroll-slider-x {
    left: 0;
    bottom: 1px;
    width: 100%;
    height: 12px;
}
```

- js部分
```js
new $.CusScrollBar({
        scrollDir: 'y', // 滚动方向
        contSelector: ".scroll-cont",	// 滚动内容区选择器
        barSelector: ".scroll-bar",	// 滚动条选择器
        sliderSelector: ".scroll-slider",	// 滚动滑块选择器
        tabItemSelector: '.tab-item',   // 标签选择器
        tabActiveClass: 'tab-active',   // 标签选中类名
        anchorSelector: '.anchor',  // 锚点选择器
        articleSelector: '.article',    // 文章选择器
        animate: true,  // 缓动滚动
        wheelStep: 80,  // 滚动步长
        duration: 250,  // 单步动画持续时间
        paddingArticle: true    // 开启文章补白
    });
```

---

# jQuery custom scroll plugin

## abstract

A custom scroll plugin base on jQuery.It can set rolling direction, rolling animation, animation speed, wheel step and padding the last article white block by **options** object parameter.

## API

|options|parameters|instruction|
|---|---|---|
|scrollDir|selector:string|rolling direction, default 'y'|
|contSelector|selector:string|scroll content selector|
|barSelector|selector:string|scroll bar selector|
|sliderSelector|selector:string|scroll slider selector|
|tabItemSelector|selector:string|tag selector, default '.tab-item'|
|tabActiveClass|class:string|selected tag's class, default 'tab-active'|
|anchorSelector|selector:string|anchor selector|
|articleSelector|selector:string|article selector, default '.article'|
|wheelStep|number|wheel step, default 200|
|animate|boolean|rolling gently? default true|
|duration|number|animation's duration, the greater of the value, the slower of the speed, default 250|
|paddingArticle|boolean|padding article? default true|

## usage

- html structre
```html
<!-- demo -->
<div class="scroll-demo">
    <!-- tags -->
    <ul class="scroll-tab clearfix">
        <li class="tab-item tab-active">Article1</li>
        <li class="tab-item">Article2</li>
        <li class="tab-item">Article3</li>
        <li class="tab-item">Article4</li>
    </ul>
    <!-- scroll content section -->
    <div class="scroll-wrap">
        <!-- scroll content -->
        <div class="scroll-cont">
            <div class="article">...</div>
            <div class="article">...</div>
            <div class="article">...</div>
            <div class="article">...</div>
        </div>

        <!-- scroll bar -->
        <div class="scroll-bar">
            <!-- slider -->
            <div class="scroll-slider"></div>
        </div>
    </div>
</div>
```

- css section
```css
.scroll-demo {
    width: 540px;
    border: 1px solid #e5e5e5;
    background: #fff;
    margin: 30px auto;
}
/* tags */
.scroll-tab {
    height: 34px;
    border-bottom: 1px solid #e5e5e5;
    color: #666;
    background: #f8f8f8;
}
.scroll-tab .tab-item {
    float: left;
    height: 100%;
    font: 14px/34px "Microsoft Yahei";
    text-align: center;
    border-right: 1px solid #e5e5e5;
    padding: 0 20px;
    cursor: pointer;
}
.scroll-tab .tab-active {
    color: #00be3c;
    background: #fff;
    border-top: 2px solid #00be3c;
    margin: -1px 0;
}
/* scroll content section */
.scroll-wrap {
    width: 100%;
    height: 300px;
    position: relative;
}
/* scroll content */
.scroll-wrap .scroll-cont {
    height: 100%;
    padding: 0 15px;
    overflow: hidden;
}
/* scroll bar */
.scroll-wrap .scroll-bar {
    position: absolute;
}
.scroll-wrap .scroll-bar-hover {
    background: #f6f6f6;
}
/* slider */
.scroll-wrap .scroll-slider {
    position: absolute;
    border-radius: 9px;
    cursor: pointer;
    background: #E7E7E7;
}
.scroll-wrap .scroll-bar-hover .scroll-slider {
    background: #959595;
}
/* scroll-y */
.scroll-wrap .scroll-bar-y {
    top: 0;
    right: 0;
    width: 14px;
    height: 100%;
}
/* slider-y */
.scroll-wrap .scroll-slider-y {
    top: 0;
    left: 1px;
    width: 12px;
    height: 100%;
}
/* scroll-x */
.scroll-wrap .scroll-bar-x {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 14px;
}
/* slider-x */
.scroll-wrap .scroll-slider-x {
    left: 0;
    bottom: 1px;
    width: 100%;
    height: 12px;
}
```

- js section
```js
new $.CusScrollBar({
        scrollDir: 'y', // rolling direction
        contSelector: ".scroll-cont",	// scroll content selector
        barSelector: ".scroll-bar",	// scroll bar selector
        sliderSelector: ".scroll-slider",	// scroll slider selector
        tabItemSelector: '.tab-item',   // tag selector
        tabActiveClass: 'tab-active',   // selected tag's class
        anchorSelector: '.anchor',  // anchor selecto
        articleSelector: '.article',    // article selector
        wheelStep: 80,  // wheel step
        animate: true,  // rolling gently
        duration: 250,  // animation's duration
        paddingArticle: true    // padding articl
    });
```
