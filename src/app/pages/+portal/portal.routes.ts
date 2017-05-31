import { MapViewCmp } from './map-view/map-view.component';
import { PortalCmp } from './portal.component';
import { LocationManagementCmp } from './location-management/location-management.component';

export const portalRoutes = [
  {
    path: '',
    component: PortalCmp,
    children: [ {
      path: '',
      redirectTo: 'location-management',
      pathMatch: 'prefix',
    }, {
      path: 'location-management',
      component: LocationManagementCmp
    }],
  },
];
