import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BMLocation } from '../../../../shared/components/map-view/models/location.interface';
import { LocationService } from '../../../../shared/providers/resource-services/location.service';
import { LocationWithPath } from './models/location-with-path.interface';

@Injectable()
export class BRMapState {
  public onMapReady: Subject<boolean>;
  public onCurrentLocationChange: Subject<LocationWithPath>;
  public onStateChanged: Subject<void>;
  public onMapViewUpdate: Subject<void>;

  private _map: L.Map;
  private _currentLocation: BMLocation;
  private _mapState: boolean = false;
  private _path: BMLocation[] = [];
  private _locations: BMLocation[];
  private _isCascade: boolean;

  public get locations() {
    return this._locations;
  }

  public get isCascade() {
    return this._isCascade;
  }

  public get currentLocation() {
    return this._currentLocation;
  }

  public get map() {
    return this._map;
  }

  public get path() {
    return this._path;
  }

  constructor(
    private _locationService: LocationService
  ) {
    this.onMapReady = new Subject<boolean>();
    this.onCurrentLocationChange = new Subject<LocationWithPath>();
    this.onStateChanged = new Subject<void>();
    this.onMapViewUpdate = new Subject<void>();
  }

  public async init() {
    try {
      this.setCurrentLocation(await this._locationService.root);
    } catch (e) {
      console.log(e);
    }
  }

  public setLocations(locations: BMLocation[]) {
    this._locations = locations;
  }

  public setMapState(flag: boolean) {
    this._mapState = flag;
    if (this._mapState) {
      this.onMapReady.next(flag);
      this.onStateChanged.next();
    }
  }

  public async setCurrentLocation(location: BMLocation) {
    this._currentLocation = await this._locationService.getLocation(location.location);
    if (!this._currentLocation.subLocations
      || !this._currentLocation.subLocations.length
    ) {
      return;
    }
    let path = await this._locationService.getLocationPath(location);
    this._path = path;
    this._isCascade = await this._locationService.isCascade(this._currentLocation);
    this.onCurrentLocationChange.next({ location, path });
    this.onStateChanged.next();
  }

  public setMap(map: L.Map) {
    this._map = map;
    this.onMapReady.next(true);
  }
}
