import { Component, Input, HostListener } from '@angular/core';
import { BMThing } from '../../../../map-view/models/thing.interface';
import { DeviceService } from '../../../../../providers/resource-services/device.service';
import { DeviceSelectorService } from '../../../providers/device-selector.service';

@Component({
  selector: 'device-selector-item',
  template: `
    <label fxLayout full-width>
      <md-checkbox [ngModel]="device.selected" (change)="toggleDevice(device, $event)" #check>
      </md-checkbox>
      <md-icon class="light-icon" [color]="device.selected? 'accent': ''">
        lightbulb_outline
      </md-icon>
      <div fxFlex="100%" text-right class="device-name">
        {{device.vendorThingID}}
      </div>
    </label>
  `,
  host: {
    'full-width': ''
  },
  styles: []
})
export class DeviceSelectorItemCmp {

  @Input()
  public device: BMThing;

  constructor(
    private _deviceService: DeviceService,
    private _deviceSelector: DeviceSelectorService
  ) { }

  public toggleDevice(device: BMThing, value: boolean) {
    this._deviceSelector.toggleDevice(device);
  }

  @HostListener('mouseenter')
  public onMouseEnter() {
    this._deviceSelector.highlightDevice(this.device);
  }

  @HostListener('mouseleave')
  public onMouseLeave() {
    this._deviceSelector.dehighlightDevice(this.device);
  }

}
