import { Component } from '@angular/core';

@Component({
  selector: 'br-location-management',
  templateUrl: './location-management.component.html',
  styles: [
    `
      md-tab-group {
        height:100%;
      }
    `
  ]
})
export class LocationManagementCmp {

  public tabChanged() {
    window.dispatchEvent(new Event('resize'));
  }
}
