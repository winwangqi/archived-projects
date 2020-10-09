# 3d-swiper

## 概述

移动端 3D 旋转轮播图

## 用法

```javascript
const carouselInstance = new Carousel(options);
```

## 配置选项

| Item | Type | Required | Desc | Default |
| --- | --- | --- | --- | --- |
| viewportSelector | selector | true | 视口选择器 | - |
| carouselWrapperSelector | selector | true | 轮播图包裹容器 | - |
| carouselItemSelector | selector | true | 轮播项选择器 | - |
| duration | number(ms) | false | 切换过渡时间 | 250 |
| changePercent | float | false | 触发切换的滑动距离占轮播项的宽度百分比 | 1 / 3 |
| itemScale | float | false | 非聚焦点缩放大小 | 0.8 |
| appendNum | number | false | 两边填充个数 | 3 |

## 实例方法

## on(type, callback)

- type：事件类型，目前支持 `change` 事件
- callback：事件回调函数

回调函数接收参数数据结构：

```javascript
{
  // 事件类型
  type: 'change',
  // 载荷
  payload: {
    // 当前项索引
    curIdx: 1
  }
}
```

## 示例

```html
<div class="box">
  <ul class="carousel-wrapper clearfix">
    <li class="carousel-item">1</li>
    <li class="carousel-item">2</li>
    <li class="carousel-item">3</li>
    <li class="carousel-item">4</li>
  </ul>
</div>
```

```javascript
var carouselInstance = new Carousel({
  viewportSelector: '.box',
  carouselWrapperSelector: '.carousel-wrapper',
  carouselItemSelector: '.carousel-item',
  duration: 250
});

carouselInstance.on('change', function (e) {
  console.log('changed');
});
```

## 提示

目前只支持移动端，请切换到手机模式查看示例