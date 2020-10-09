/**
 * 滑动到底部加载更多
 * @param options
 */

export default class {
  constructor (options) {
    this.containerElem = options.container || document;
    this.contentElem = options.content || document.body;

    this.fireHandler = options.handler;
    this.offset = options.offset || 0;

    this.visHeight = this.containerElem.clientHeight || document.documentElement.clientHeight;
    this.isLoading = false;
    this.noMore = false;

    this.init();
  }

  init() {
    this.containerElem.addEventListener('scroll', this._scrollHandler.bind(this), false);
  }

  fire() {
    this.fireHandler();
  }

  _scrollHandler() {
    const { scrollHeight, scrollTop } = this.contentElem;
    if (this.visHeight + scrollTop + this.offset >= scrollHeight && !this.isLoading && !this.noMore) this.fireHandler();
  }
};