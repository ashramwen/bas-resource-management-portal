import { Component, Input } from '@angular/core';

@Component({
  selector: 'swipe-tab',
  template: `
    <div class="container-tab">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      float: left;
    }
    
  `]
})
export class SwipeTabCmp {
  @Input()
  public activeClass: string;
}
