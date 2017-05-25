import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Location } from '../../../models/location.interface';
import { Building } from '../../../models/building.interface';
import { LocationService } from '../../../providers/resource-services/location.service';
import { Thing } from '../../../models/thing.interface';
import { BMLocation } from '../../map-view/models/location.interface';
import { LocationWithPath } from '../models/location-with-path.interface';
import { BMThing } from '../../map-view/models/thing.interface';

@Injectable()
export class StateService {
  public onLayerChanged: Subject<L.Polygon[]>;
  public onMapReady: Subject<boolean>;
  public onSelectionModeChange: Subject<boolean>;
  public onCurrentLocationChange: Subject<LocationWithPath>;
  public onStateChanged: Subject<void>;
  public onIsLocationSelectorChange: Subject<boolean>;
  public onMapViewUpdate: Subject<void>;

  private _devices: BMThing[] = [];
  private _map: L.Map;
  private _selectionMode: boolean = false;
  private _currentLocation: BMLocation;
  private _mapState: boolean = false;
  private _layers: L.Polygon[] = [];
  private _path: BMLocation[] = [];
  private _locations: BMLocation[];
  private _isCascade: boolean;
  private _isLocationSelector: boolean = true;

  public get locations() {
    return this._locations;
  }

  public get devices() {
    return this._devices;
  }

  public get isCascade() {
    return this._isCascade;
  }

  public get isLocationSelector() {
    return this._isLocationSelector;
  }

  public get layers() {
    return this._layers;
  }

  public get selectionMode() {
    return this._selectionMode;
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
    this.onLayerChanged = new Subject<L.Polygon[]>();
    this.onMapReady = new Subject<boolean>();
    this.onSelectionModeChange = new Subject<boolean>();
    this.onCurrentLocationChange = new Subject<LocationWithPath>();
    this.onStateChanged = new Subject<void>();
    this.onIsLocationSelectorChange = new Subject();
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

  public setDevices(devices: Thing[]) {
    this._devices = devices;
  }

  public setIsLocationSelector(value: boolean) {
    this._isLocationSelector = value;
    this.onIsLocationSelectorChange.next(value);
  }

  public loadLayers(layers: L.Polygon[]) {
    this._layers = layers;
    this.onLayerChanged.next(this._layers);
    this.onStateChanged.next();
  }

  public setMapState(flag: boolean) {
    this._mapState = flag;
    if (this._mapState) {
      this.onMapReady.next(flag);
      this.onStateChanged.next();
    }
  }

  public setSelectionMode(mode: boolean) {
    this._selectionMode = mode;
    this.onSelectionModeChange.next(mode);
    this.onStateChanged.next();
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
    this._isLocationSelector = this._isCascade ? true : this._isLocationSelector;
    this.onCurrentLocationChange.next({ location, path });
    this.onStateChanged.next();
  }

  public setMap(map: L.Map) {
    this._map = map;
    this.onMapReady.next(true);
  }
}
