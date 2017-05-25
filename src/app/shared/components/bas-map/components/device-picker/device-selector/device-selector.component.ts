import { Component, Input, SimpleChanges } from '@angular/core';
import { Thing } from '../../../../../models/thing.interface';
import { DeviceService } from '../../../../../providers/resource-services/device.service';
import { Location } from '../../../../../models/location.interface';
import { DeviceSelectorService } from '../../../providers/device-selector.service';
import { BMThing } from '../../../../map-view/models/thing.interface';

@Component({
  selector: 'bm-device-seletor',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss']
})
export class DeviceSelectorCmp {

  constructor(
    private _deviceService: DeviceService,
    private _deviceSelector: DeviceSelectorService
  ) { }

  public get devices() {
    return this._deviceSelector.selectedDevices;
  }
}
