import {
  Component,
  Input,
  ViewEncapsulation,
  trigger,
  state,
  style,
  transition,
  animate,
  SimpleChanges
} from '@angular/core';
import { StateService } from '../../providers/state.service';
import { OnChanges } from '@angular/core';
import { LocationService } from '../../../../providers/resource-services/location.service';
import { DeviceService } from '../../../../providers/resource-services/device.service';
import { Location } from '../../../../models/location.interface';
import { Thing } from '../../../../models/thing.interface';
import { LocationSelector } from '../../providers/location-selector.service';

export interface DeviceCheck extends Thing {
  checked: boolean;
}

@Component({
  selector: 'bm-device-picker',
  templateUrl: './device-picker.component.html',
  styleUrls: ['./device-picker.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('active', style({ opacity: 1, transform: 'translateX(0)' })),
      state('inactive', style({ opacity: 0, transform: 'translateX(130%)' })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class DevicePickerCmp {

  @Input()
  public active: boolean;

  public set isLocationSelector(value) {
    this.myState.setIsLocationSelector(value);
  }

  public get isLocationSelector() {
    return this.myState.isLocationSelector;
  }

  public deviceList: DeviceCheck[] = [];

  constructor(
    private myState: StateService,
    private _locationService: LocationService,
    private _deviceService: DeviceService,
    private locationSelector: LocationSelector
  ) { }

  public get locations() {
    return this.locationSelector.selectedLocations || [];
  }

  public get isCascade() {
    return this.myState.isCascade;
  }
}
