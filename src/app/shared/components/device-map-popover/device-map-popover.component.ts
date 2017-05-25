import {
  Directive,
  Input,
  HostListener
} from '@angular/core';
import { Thing } from '../../models/thing.interface';
import { LocationService } from '../../providers/resource-services/location.service';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { MapViewCmp } from '../map-view/map-view.component';

@Directive({
  selector: '[bas-device-map-popover]'
})
export class DeviceMapPopover {
  @Input()
  public device: Thing;

  constructor(
    private _locationService: LocationService,
    private _modal: MdDialog
  ) { }

  @HostListener('click')
  public async showPopover() {
    if (!this.device || !this.device.locations || !this.device.locations.length) {
      return;
    }
    let modal = this._modal.open(MapViewCmp, this._dialogConfig);
    let instance = modal.componentInstance;
    let path = await this._locationService.getLocationPath(this.device.locations[0]);
    let location = path.reverse().find((l) => !!l.geos && !!l.geos.length);
    instance.locations = location ? [location] : [];
    instance.devices = [this.device];
  }

  private get _dialogConfig() {
    let config: MdDialogConfig = {
      width: '50%',
      height: '50%'
    };

    return config;
  }

}
