import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'bas-toolbar',
  template: `
    <div fxLayout="row" fxFlex="100" fxLayoutAlign="space-between center">
      <h1><ng-content></ng-content></h1>
      <button md-icon-button (click)="showUser.emit()">
        <md-icon class="portrait" color="primary">account_circle</md-icon>
      </button>
    </div>
  `,
  styleUrls: [
    `./toolbar.component.scss`
  ]
})
export class ToolbarCmp {
  @Output() public showUser: EventEmitter<any> = new EventEmitter();
}
