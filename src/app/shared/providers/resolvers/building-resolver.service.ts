import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContactsService } from './contacts.service';
import { Location } from '../../models/location.interface';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { RootState } from '../../redux/index';
import { AddAction } from '../../redux/location/actions';
import { StateSelectors } from '../../redux/selectors';
import { createSelector } from 'reselect';
import { LocationState } from '../../redux/location/reducer';
import { MapService } from '../map.service';
import { Building } from '../../models/building.interface';

interface LocationResponse {
  location: string;
  locationLevel: string;
  subLocations: { [subLocation: string]: LocationResponse };
}

@Injectable()
export class BuildingResolver implements Resolve<Building[]> {

  constructor(private mapService: MapService) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.mapService.getBuildingsGeo();
  }
}
