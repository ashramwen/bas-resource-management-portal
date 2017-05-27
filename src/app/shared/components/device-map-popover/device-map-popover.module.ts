import { NgModule } from '@angular/core';
import { MapViewModule } from '../../components/map-view/map-view.mdoule';
import { MapViewCmp } from '../../components/map-view/map-view.component';

import { DeviceMapPopover } from './device-map-popover.component';
import { MatCustomModule } from 'kii-universal-ui';

@NgModule({
  imports: [
    MapViewModule,
    MatCustomModule,
  ],
  entryComponents: [MapViewCmp],
  declarations: [DeviceMapPopover],
  exports: [DeviceMapPopover]
})
export class DeviceMapPopoverModule { }
