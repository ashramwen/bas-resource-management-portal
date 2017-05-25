import {
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';
import { SwipeTabCmp } from './swipe-tab.component';
import { DomSanitizer } from '@angular/platform-browser';
import { replace } from '@ngrx/router-store';

@Component({
  selector: 'swipe-wrapper',
  template: `
    <div class="portal-container" [style.transform]="transform">
      <div [class]="classes" [style.width]="tabs?.length * 100 + '%'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .portal-container{
        position: relative;
        width: 100%;
        height: 100%;
        transition: all 0.3s;
      }

      .portal-container .portal-wrapper{
        transition: all 0.3s;
        height: 100%;
        background-color: #fafafa;
        display: flex;
      }

      .portal-wrapper.user-info{
        background-color:#2ca1f4 !important;
      }
      :host {
        width: 100%;
        height: 100%;
        display: block;
        overflow: hidden;
      }
    `
  ]
})
export class SwipeWrapperCmp {
  @ContentChildren(SwipeTabCmp)
  public tabs: QueryList<SwipeTabCmp>;

  @Input()
  public index: number = 0;

  get transform() {
    return 'translateX(' + -this.index * 100 + '%)';
  }

  get classes() {
    if (!this.tabs) {
      return 'portal-wrapper';
    }
    return ['portal-wrapper', this.tabs.toArray()[this.index || 0].activeClass || ''].join(' ');
  }

  constructor(
    private sanitizer: DomSanitizer
  ) { }
}
