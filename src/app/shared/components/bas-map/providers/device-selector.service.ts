import { Injectable } from '@angular/core';
import { BMLocation } from '../../map-view/models/location.interface';
import { BMThing } from '../../map-view/models/thing.interface';
import { StateService } from './state.service';

@Injectable()
export class DeviceSelectorService {

  private _selectedDevices: BMThing[] = [];

  public get selectedDevices() {
    return this._selectedDevices;
  }

  constructor(
    private myState: StateService
  ) {
    this.myState.onIsLocationSelectorChange.subscribe(() => {
      this.clearSelection();
    });
    this.myState.onSelectionModeChange.subscribe(() => {
      this.clearSelection();
    });
  }

  public selectLocation(location: BMLocation) {
    let devices = this.myState.devices.filter((d) => {
      return !!d.locations && d.locations.find((l) => {
        return !!l.match(`^${location.location}`);
      });
    });
    devices.forEach((d) => {
      d.selected = true;
      if (this._selectedDevices.indexOf(d) === -1) {
        this._selectedDevices.push(d);
      }
    });
    this.myState.onMapViewUpdate.next();
  }

  public toggleDevice(device: BMThing) {
    if (device.selected) {
      this.deselectDevice(device);
    } else {
      this.selectDevice(device);
    }
  }

  public clearSelection() {
    this._selectedDevices.forEach((d) => {
      d.selected = false;
    });
    this.myState.onMapViewUpdate.next();
  }

  public deselectDevice(device: BMThing) {
    device.selected = false;
    this._selectedDevices.splice(this._selectedDevices.indexOf(device), 1);

    this.myState.onMapViewUpdate.next();
  }

  public selectDevice(device: BMThing) {
    device.selected = true;
    this._selectedDevices.push(device);

    this.myState.onMapViewUpdate.next();
  }

  public highlightDevice(device: BMThing) {
    device.highlighted = true;

    this.myState.onMapViewUpdate.next();
  }

  public dehighlightDevice(device: BMThing) {
    device.highlighted = false;

    this.myState.onMapViewUpdate.next();
  }
}
