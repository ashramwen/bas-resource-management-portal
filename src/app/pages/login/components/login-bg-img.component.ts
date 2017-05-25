import {
  Component,
  HostListener,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  NgZone
} from '@angular/core';

@Component({
  selector: 'bas-login-bg-img',
  template: `
  `,
  styles: [
    `
      :host{
        position: absolute;
        top: 0px;
        left: 0px;
        background-position: center;
        display: block;
        width: 100%;
        height: 100%;
        background-image: url(./assets/img/login-bg.png) ;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-position: bottom; 
        background-size: cover;
        transition: all 0.3s;
      }
    `
  ]
})
export class LoginBgImgComponent implements AfterViewInit, OnDestroy {

  @HostBinding('style.background-position-y.px')
  public backgroundPositionY: number;

  private _pJS: any;
  private imgSize: {
    height: number;
    width: number;
  } = null;

  constructor(
    private _zone: NgZone
  ) { }

  @HostListener('window:resize')
  public onResize(event) {
    this._recalcBgPosition();
  }

  public ngAfterViewInit() {
    this._getImgSize();
  }

  public ngOnDestroy() {
    if (this._pJS) {
      this._pJS.fn.vendors.destroy();
    }
  }

  private _recalcBgPosition() {
    if (!this.imgSize) {
      return;
    }
    let fitSize = this._getFitSize();
    let html = document.querySelector('html');
    this.backgroundPositionY = html.clientHeight - fitSize.height / 3 * 2;
  }

  private _getImgSize() {
    let img = new Image();
    img.src = './assets/img/login-bg.png';
    img.onload = () => {
      this.imgSize = img;
      this._zone.run(() => {
        this._recalcBgPosition();
      });
    };
  }

  private _getFitSize() {
    let html = document.querySelector('html');
    let ratioW = this.imgSize.width / html.clientWidth;
    let ratioH = this.imgSize.height / html.clientHeight;
    let ratio: number = null;
    ratio = ratioW > ratioH ? ratioH : ratioW;

    return {
      height: this.imgSize.height / ratio,
      width: this.imgSize.width / ratio
    };
  }

}
