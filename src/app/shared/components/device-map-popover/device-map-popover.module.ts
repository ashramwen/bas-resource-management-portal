import { NgModule } from '@angular/core';
import { MapViewModule } from '../../components/map-view/map-view.mdoule';
import { MapViewCmp } from '../../components/map-view/map-view.component';

import { DeviceMapPopover } from './device-map-popover.component';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [MapViewModule, MaterialModule],
  entryComponents: [MapViewCmp],
  declarations: [DeviceMapPopover],
  exports: [DeviceMapPopover]
})
export class DeviceMapPopoverModule { }
