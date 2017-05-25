import {
  Component,
  HostListener,
  AfterViewInit,
  OnDestroy,
  HostBinding,
  NgZone
} from '@angular/core';

import { particles } from './particles';

@Component({
  selector: 'bas-login-bg',
  template: `
    <bas-login-bg-img></bas-login-bg-img>
    <div id="bg-animation"></div>
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: center;
        overflow: hidden;
      }
      :host bas-login-bg-img{
        z-index: 0;
      }
      :host #bg-animation {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0px;
          top: 0px;
          z-index: 1;
      }
    `
  ]
})
export class LoginBgComponent implements AfterViewInit, OnDestroy {

  private _pJS: any;

  public ngAfterViewInit() {
    this.renderAnimation();
  }

  public ngOnDestroy() {
    if (this._pJS) {
      this._pJS.fn.vendors.destroy();
    }
  }

  private renderAnimation() {
    let html = document.querySelector('html');

    this._pJS = particles('bg-animation', {
      particles: {
        color: '#fff',
        shape: 'circle', // "circle", "edge" or "triangle"
        opacity: 1,
        size: 4,
        size_random: true,
        nb: 150 / 1000000 * html.clientWidth * html.clientHeight,
        line_linked: {
          enable_auto: true,
          distance: 100,
          color: '#fff',
          opacity: 1,
          width: 1,
          condensed_mode: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
        anim: {
          enable: true,
          speed: 1
        }
      },
      interactivity: {
        enable: true,
        mouse: {
          distance: 300
        },
        detect_on: 'canvas', // "canvas" or "window"
        mode: 'grab',
        line_linked: {
          opacity: .5
        },
        events: {
          onclick: {
            enable: true,
            mode: 'push', // "push" or "remove"
            nb: 4
          }
        }
      },
      /* Retina Display Support */
      retina_detect: true
    });
  }
}
