import { Component } from '@angular/core';

@Component({
  selector: 'br-mapview',
  template: `
    <bm-map-view
      [locations]="[]"
      [devices]="[]"
    ></bm-map-view>
  `,
  styles: [`

  `]
})
export class BRLocationMapViewCmp {

  constructor() { }

}
