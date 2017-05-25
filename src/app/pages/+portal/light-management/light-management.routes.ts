import { BuildingResolver } from '../../../shared/providers/resolvers/building-resolver.service';
import { DeviceListCmp } from './device-list/device-list.component';
import { LandingCmp } from './landing/landing.component';
import { LightResolver } from '../../../shared/providers/resolvers/light-resolver.service';
import { LightsResolver } from '../../../shared/providers/resolvers/lights-resolver.service';
import { MapViewCmp } from './map-view/map-view.component';

export const lightManagementRoutes = [
  {
    path: 'landing',
    component: LandingCmp,
    resolve: {
      lightings: LightsResolver
    }
  },
  {
    path: 'map-view',
    component: MapViewCmp,
    resolve: {
      buildings: BuildingResolver
    }
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'prefix',
  },
  {
    path: 'device-list',
    children: [
      {
        path: '',
        component: DeviceListCmp,
        resolve: {
          lightings: LightsResolver
        }
      }
    ]
  }
];
