import { BasMapModule } from './bas-map/bas-map.module';
import { MapViewModule } from './map-view/map-view.mdoule';
import { DeviceMapPopoverModule } from './device-map-popover/device-map-popover.module';
import { StatusTreeModule } from './status-tree/status-tree.module';

export const SHARED_MODULES = [
  BasMapModule,
  MapViewModule,
  DeviceMapPopoverModule,
  StatusTreeModule
];
