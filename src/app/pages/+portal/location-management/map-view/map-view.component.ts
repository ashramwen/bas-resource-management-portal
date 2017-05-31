import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';

import { BRMapState } from './map-view.state';
import { MapViewCmp } from '../../../../shared/components/map-view/map-view.component';
import { BMLocation } from '../../../../shared/components/map-view/models/location.interface';
import { LocationService } from '../../../../shared/providers/resource-services/location.service';
import {
  BackButtonControl
} from '../../../../shared/components/bas-map/leaflet-plugins/back-button/back-button.control';

@Component({
  selector: 'br-mapview',
  template: `
    <div class="map-container">
      <bm-map-view
        (mapInit)="mapInited($event)"
        (layerClick)="onLayerClick($event)"
        (markerClick)="onMarkerClick($event)"
        [locations]="myState.locations"
        [zoom]="zoom"
      ></bm-map-view>

      <md-card class="location-picker">
        <md-card-content>
          <br-location-navigator></br-location-navigator>
        </md-card-content>
      </md-card>
    </div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .location-picker{
      z-index: 3;
      position: absolute !important;
      bottom: 20px;
      left: 20px;
      padding: 10px !important;
    }

    .bm-back-button{
      background: transparent;
      outline: none;
      margin: 0px;
      display: block;
      width: 50px;
      height: 50px;
      line-height: 53px;
      padding: 0px;
      padding-top: 2px;
      border-radius: 100%;
      border: solid 3px #fff;
      text-align: center;
      cursor: pointer;
      opacity: 0.7;
      transition: all 0.2s;
    }
    .bm-back-button:hover{
        opacity: 1;
    }
    .bm-back-button .md-icon {
      color: #fff;
      font-size: 40px;
    }
  `],
  providers: [BRMapState],
  encapsulation: ViewEncapsulation.None
})
export class BRLocationMapViewCmp {

  @ViewChild(MapViewCmp)
  public mapTarget: MapViewCmp;

  public get zoom() {
    return !this.myState.path ? 18 : (this.myState.path.length + 16);
  }

  private backButtonControl: L.Control;

  /**
   * @description back button is visible or not
   */
  public get backButtonIsVisible(): boolean {
    return _.isNumber(this.myState.currentLocation.parentID);
  }

  constructor(
    public myState: BRMapState,
    private _locationService: LocationService,

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
    // todo
  }

  private async _init() {
    await this.myState.init();
    this.myState.map.removeControl(this.myState.map['zoomControl']);
    this.backButtonControl = new BackButtonControl({ position: 'topleft' });
    this.myState.map.on('level-back', () => {
      this._goBack();
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
