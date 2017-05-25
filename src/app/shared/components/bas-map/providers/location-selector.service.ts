import { Injectable, OnInit } from '@angular/core';
import { MapUtils } from '../utils';
import { AreaFeature } from '../../../models/building.interface';
import { Location } from '../../../models/location.interface';
import { Store } from '@ngrx/store';
import { RootState } from '../../../redux/index';
import { StateSelectors } from '../../../redux/selectors';
import { StateService } from './state.service';
import { BMLocation } from '../../map-view/models/location.interface';

@Injectable()
export class LocationSelector {

  private _selectedLocations: BMLocation[] = [];

  constructor(
    private myState: StateService
  ) {
    myState.onSelectionModeChange.subscribe(() => {
      this.clearSelection();
    });
    myState.onIsLocationSelectorChange.subscribe(() => {
      this.clearSelection();
    });
  }

  public get selectedLocations(): Location[] {
    return this._selectedLocations;
  }

  public toggleLocation(location: BMLocation) {
    if (location.selected) {
      this.deselectLocation(location);
    } else {
      this.selectLocation(location);
    }
  }

  public clearSelection() {
    this._selectedLocations.forEach((l) => {
      l.selected = false;
    });
    this._selectedLocations = [];

    // invoke change
    this.myState.onMapViewUpdate.next();
  }

  public selectLocation(location: BMLocation) {
    location.selected = true;
    this._selectedLocations.push(location);

    // invoke change
    this.myState.onMapViewUpdate.next();
  }

  public deselectLocation(location: BMLocation) {
    location.selected = false;
    this._selectedLocations.splice(this._selectedLocations.indexOf(location), 1);

    // invoke change
    this.myState.onMapViewUpdate.next();
  }
}
