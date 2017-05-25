import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  SelectionButtonControl
} from './leaflet-plugins/selection-button/selection-button.control';
import { AreaFeature, Building } from '../../models/building.interface';
import { ViewLevel } from './view-level.type';
import { Location } from '../../models/location.interface';
import { BackButtonControl } from './leaflet-plugins/back-button/back-button.control';
import 'leaflet-compass/dist/leaflet-compass.min.js';
import { RootState } from '../../redux/index';
import { StateSelectors } from '../../redux/selectors';
import { StateService } from './providers/state.service';
import { LocationService } from '../../providers/resource-services/location.service';
import { DeviceService } from '../../providers/resource-services/device.service';
import { BMLocation } from '../map-view/models/location.interface';
import { LocationSelector } from './providers/location-selector.service';
import { DeviceSelectorService } from './providers/device-selector.service';
import { BMThing } from '../map-view/models/thing.interface';
import { Output } from '@angular/core';
import { Thing } from '../../models/thing.interface';
import { MapViewCmp } from '../map-view/map-view.component';

@Component({
  selector: 'bas-map',
  templateUrl: './bas-map.component.html',
  styleUrls: [
    './bas-map.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [StateService, LocationSelector, DeviceSelectorService],
})
export class BasMap implements OnInit {

  @ViewChild(MapViewCmp)
  public mapTarget: MapViewCmp;

  @Output()
  public deviceClick: EventEmitter<Thing> = new EventEmitter();

  public get zoom() {
    return !this.myState.path ? 18 : (this.myState.path.length + 16);
  }

  private backButtonControl: L.Control;
  private selectionButtonControl: L.Control;

  /**
   * @description back button is visible or not
   */
  public get backButtonIsVisible(): boolean {
    return !this.myState.selectionMode
      && _.isNumber(this.myState.currentLocation.parentID);
  }

  constructor(
    public myState: StateService,
    private store: Store<RootState>,
    private _locationService: LocationService,
    private _deviceService: DeviceService,
    private _locationSelector: LocationSelector,
    private _deviceSelector: DeviceSelectorService
  ) { }

  public mapInited(map: L.Map) {
    this.myState.setMap(map);
  }

  public ngOnInit() {
    this.myState.onCurrentLocationChange.subscribe(() => {
      this._onLocationChanged();
    });
    this.myState.onStateChanged.subscribe((location) => {
      this._onStateChange();
    });
    this.myState.onMapReady.subscribe(async () => {
      await this._init();
    });
    this.myState.onMapViewUpdate.subscribe(() => {
      this.mapTarget.updateView();
    });
  }

  /**
   * when any layer is clicked
   * 
   * @param {BMLocation} location 
   * 
   * @memberOf BasMap
   */
  public onLayerClick(location: BMLocation) {
    if (this.myState.selectionMode) {
      if (this.myState.isLocationSelector) {
        this._locationSelector.toggleLocation(location);
      } else {
        this._deviceSelector.selectLocation(location);
      }
    } else {
      this.myState.setCurrentLocation(location);
    }
  }

  public onMarkerClick(device: BMThing) {
    if (this.myState.selectionMode) {
      if (this.myState.isCascade) {
        return;
      }
      if (this.myState.isLocationSelector) {
        this.myState.setIsLocationSelector(false);
      }
      this._deviceSelector.toggleDevice(device);
    } else {
      this.deviceClick.emit(device);
    }
  }

  private async _init() {
    await this.myState.init();
    this.myState.map.removeControl(this.myState.map['zoomControl']);
    let CompassControl = L.Control['Compass'];
    this.backButtonControl = new BackButtonControl({ position: 'topleft' });
    this.selectionButtonControl = new SelectionButtonControl({ position: 'bottomright' });
    this.myState.map.addControl(this.selectionButtonControl);
    this.myState.map.on('level-back', () => {
      this._goBack();
    });
    this.myState.map.on('selection-mode-change', (event) => {
      this.myState.setSelectionMode(event['state']);
    });
  }

  /**
   * update location and devices display on map
   * 
   * @private
   * 
   * @memberOf BasMap
   */
  private _onLocationChanged() {
    let siblings: BMLocation[] = [];
    let children: BMLocation[] = [];
    let currentLocation = this.myState.currentLocation;

    if (this.myState.path[this.myState.path.length - 2]) {
      let _siblings = this.myState.path[this.myState.path.length - 2].subLocations || [];
      siblings = _siblings.map((l) => Object.assign(l, {
        disabled: true
      }));
    }
    if (currentLocation) {
      children = currentLocation.subLocations || [];
    }
    this.myState.setLocations([...siblings, ...children]);
    this._getDevices();
  }

  /**
   * get location related devices
   * 
   * @private
   * 
   * @memberOf BasMap
   */
  private async _getDevices() {
    try {
      let currentLocation = this.myState.currentLocation;
      if (this.myState.isCascade) {
        let devices = await this._deviceService.getThingsByLocation(currentLocation, false);
        this.myState.setDevices(devices);
      } else {
        let devices = await this._deviceService.getThingsByLocation(currentLocation, true);
        this.myState.setDevices(devices);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * go previous level
   * 
   * @private
   * 
   * @memberOf BasMap
   */
  private async _goBack() {
    let parent = await this._locationService.getParentLocation(this.myState.currentLocation);
    await this.myState.setCurrentLocation(parent);
  }

  /**
   * when any state changed
   * 
   * @private
   * @returns 
   * 
   * @memberOf BasMap
   */
  private _onStateChange() {
    if (!this.myState.currentLocation) {
      return;
    }
    if (this.backButtonControl) {
      if (this.backButtonIsVisible) {
        this.myState.map.addControl(this.backButtonControl);
      } else {
        this.myState.map.removeControl(this.backButtonControl);
      }
    }
  }
}
