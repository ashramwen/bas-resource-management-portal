import { BuildingResolver } from '../../shared/providers/resolvers/building-resolver.service';
import { DeviceListCmp } from './device-list/device-list.component';
import { LandingCmp } from './landing/landing.component';
import { LightResolver } from '../../shared/providers/resolvers/light-resolver.service';
import { LightsResolver } from './../../shared/providers/resolvers/lights-resolver.service';
import { LocationCmp } from './location/location.component';
import { MapViewCmp } from './map-view/map-view.component';
import { PortalCmp } from './portal.component';
import { lightManagementRoutes } from './light-management/light-management.routes';
import { profileRoutes } from './profile/profile.routes';

export const portalRoutes = [
  {
    path: '',
    component: PortalCmp,
    children: [{
      path: 'light-management',
      children: [...lightManagementRoutes]
    }, {
      path: 'profile',
      children: [...profileRoutes]
    }, {
      path: '',
      redirectTo: 'light-management',
      pathMatch: 'prefix',
    }],
  },
];
