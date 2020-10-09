import foldCube from './style/fold-cube';
import iosLoading from './style/ios-loading';

const loading = {
  init() {
    this.scale = window.screen.width / 750;
    this.layerW = 150;

    this.layerStyle = {
      display: 'none',
      position: 'fixed',
      top: '50%',
      left: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      width: `${this.layerW * this.scale}px`,
      height: `${this.layerW * this.scale}px`,
      margin: `-${this.layerW / 2 * this.scale}px 0 0 -${this.layerW / 2 * this.scale}px`,
      color: '#fff',
      background: 'rgba(0, 0, 0, .6)',
      borderRadius: '4px',
      zIndex: 20170822
    };

    this.layerElem = document.createElement('div');
    Object.assign(this.layerElem.style, this.layerStyle);
    this.layerElem.innerHTML = iosLoading;

    document.body.appendChild(this.layerElem);
  },
  show() {
    this.layerElem.style.display = 'flex';
  },
  hide() {
    this.layerElem.style.display = 'none';
  }
};

loading.init();


export default loading;