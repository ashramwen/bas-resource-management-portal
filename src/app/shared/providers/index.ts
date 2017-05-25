import { ConfigHelper } from './helpers/config-helper';
import { GUARD_SERVICES } from './guards/index';
import { HELPER_SERVICES } from './helpers/index';
import { MapService } from './map.service';
import { RESOLVERS } from './resolvers/index';
import { RequestHelper } from './helpers/request-helper';
import { SessionService } from './session.service';
import { StompService } from './stomp.service';
import { EsQueryService } from './resource-services/es-query.service';
import { DeviceService } from './resource-services/device.service';
import { LocationResourceService } from './resource-services/location-resource.service';
import { LocationService } from './resource-services/location.service';

export const SHARED_PROVIDERS = [
  // helpers
  ...HELPER_SERVICES,

  // shared services
  SessionService,
  LocationResourceService,
  LocationService,
  MapService,
  DeviceService,
  EsQueryService,
  StompService,

  // Route Guard services
  ...GUARD_SERVICES,

  // Route data resolvers
  ...RESOLVERS
];
