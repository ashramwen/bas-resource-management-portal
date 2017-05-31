import { Component, HostListener, HostBinding } from '@angular/core';
import {
  ComponentRef
} from '../../../../shared/components/status-tree/status-tree-node-content.component';
import { Location } from '../../../../shared/models/location.interface';
import { BRLocationListViewService } from './list-view.service';

@Component({
  selector: 'br-list-item',
  template: `
    <md-icon>domain</md-icon>
    <span>{{location.displayNameCN}}</span>
  `,
  styles: [
    `
      :host {
        line-height: 24px;
        width: 60px;
        padding: 0px 5px;
        height: 24px;
      }
      md-icon{
        vertical-align: middle;
        height: 18px;
        width: 18px;
        font-size: 18px;
      }

      :host:hover {
        background: #f2f6f7;
        border-radius: 5px;
      }
      :host.active {
        background: #f38e3c;
        border-radius: 5px;
        color: #fff;
      }
    `
  ]
})
export class BRLocationListItemCmp {

  private location: Location;

  constructor(
    private _comRef: ComponentRef<Location>,
    private _listViewService: BRLocationListViewService,
  ) {
    this.location = _comRef.data.data;
  }

  @HostBinding('class.active')
  public get active() {
    return this._listViewService.currentLocation === this.location;
  }

  @HostListener('click')
  public onItemClick() {
    this._listViewService.currentNode = this._comRef.data;
  }

}
