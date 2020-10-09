import '../style/Modal.less';

/* ====== CONST VARIABLE ====== */

const MODAL_CLS = {
  /* === backdrop === */
  BACKDROP: 'modal-backdrop',
  BACKDROP_IN: 'fadeIn',
  BACKDROP_OUT: 'fadeOut',
  /* === modal-dialog === */
  DIALOG_IN: 'fadeInDown',
  DIALOG_OUT: 'fadeOutUp'
};

const backdropSingleton = {
  instance: null,
  getInstance() {
    if (!this.instance) {
      const backdrop = document.createElement('div');
      backdrop.style.display = 'none';
      backdrop.classList.add(MODAL_CLS.BACKDROP);
      document.body.appendChild(backdrop);
      this.instance = backdrop;
    }
    return this.instance;
  }
};


/* ====== DEFINE CLASS ====== */
/**
 * Modal
 * 传入参数：
 *    1. modalSelector: 模态框选择器
 *    2. backdrop: 点击背景层是否隐藏模态框
 */

class Modal {
  constructor(...rest) {
    const _param = { modalSelector: null, backdrop: true };

    if (rest.length !== 1) {
      throw new Error('Invalid number of parameters.');
    } else {
      const argu = rest[0];

      if (typeof argu === 'string') {
        _param.modalSelector = argu;
      } else if (typeof argu === 'object') {
        Object.assign(_param, argu);
      }
    }

    this.init(_param);
  }

  init({ modalSelector, backdrop }) {
    // store DOM element
    this.modalElem = document.querySelector(modalSelector);
    if (!this.modalElem) throw new Error('Wrong modal selector.');
    this.modalDialogElem = this.modalElem.firstElementChild;
    this.modalDismissElems = Array.from(this.modalDialogElem.querySelectorAll('[data-dismiss="modal"]'));
    this.backdropElem = backdropSingleton.getInstance();
    this.backdrop = backdrop;

    // bind event
    this.modalElem.addEventListener('click', e => {
      if (this.backdrop && e.target.classList.contains('modal')) this.hide();
    }, false);
    this.modalElem.addEventListener('animationend', e => {
      if (this.backdropElem.classList.contains('fadeOut')) {
        document.body.classList.remove('modal-open');
        this.backdropElem.style.display = 'none';
        this.modalElem.style.display = 'none';
      }
    }, false);
    this.modalDismissElems.forEach(dismissElem => dismissElem.addEventListener('click', this.hide.bind(this), false));
  }

  show() {
    // operate element style
    this.backdropElem.style.display = 'block';
    this.modalElem.style.display = 'flex';

    // operate element class
    document.body.classList.add('modal-open');
    this.backdropElem.classList.remove(MODAL_CLS.BACKDROP_OUT);
    this.backdropElem.classList.add('animated', MODAL_CLS.BACKDROP_IN);
    this.modalDialogElem.classList.remove(MODAL_CLS.DIALOG_OUT);
    this.modalDialogElem.classList.add('animated', MODAL_CLS.DIALOG_IN);
  }

  hide() {
    // operate element class
    this.backdropElem.classList.remove(MODAL_CLS.BACKDROP_IN);
    this.backdropElem.classList.add(MODAL_CLS.BACKDROP_OUT);
    this.modalDialogElem.classList.remove(MODAL_CLS.DIALOG_IN);
    this.modalDialogElem.classList.add(MODAL_CLS.DIALOG_OUT);
  }
}


/* ====== init operation ====== */

const modalMap = new Map();
const modalToggleBtnElems = Array.from(document.querySelectorAll('[data-toggle="modal"]'));

modalToggleBtnElems.forEach(btnElem => {
  const _modal = btnElem.dataset.target;
  if (modalMap.has(_modal)) {
    btnElem.modal = modalMap.get(_modal);
  } else {
    const newModal = new Modal(_modal);
    modalMap.set(_modal, newModal);
    btnElem.modal = newModal;
  }
  btnElem.addEventListener('click', () => { btnElem.modal.show() }, false);
});

/* ====== export module for ES6 ====== */
export default Modal;
