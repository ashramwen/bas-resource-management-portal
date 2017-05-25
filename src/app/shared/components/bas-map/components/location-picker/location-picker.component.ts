import { Component, OnInit } from '@angular/core';
import { StateService } from '../../providers/state.service';
import { Location } from '../../../../models/location.interface';
import { LocationService } from '../../../../providers/resource-services/location.service';

interface LocationNode {
  selected: Location;
  selectedValue: string;
  options: Location[];
}

@Component({
  selector: 'bm-location-picker',
  template: `
    <md-select no-underline text-center
        placeholder-hidden
        placeholder="- Select -"
        (change)="selectOnChange(locationNode, $event.value)"
        [ngModel]="locationNode.selectedValue"
        *ngFor="let locationNode of locationArr">
      <md-option 
        *ngFor="let option of locationNode.options" 
        [value]="option.location">
          {{option.displayNameCN}}
      </md-option>
    </md-select>
  `
})
export class LocationPickerCmp implements OnInit {

  public locationArr: LocationNode[] = [];

  constructor(
    private myState: StateService,
  ) { }

  public ngOnInit() {
    this.myState.onCurrentLocationChange.subscribe(async(locationWithPath) => {
      this.locationArr = [];
      this.updateLocationArr(locationWithPath.path);
      if (!!this.myState.currentLocation.subLocations
        && this.myState.currentLocation.subLocations.length) {
          this.locationArr.push({
            selected: null,
            selectedValue: null,
            options: this.myState.currentLocation.subLocations
          });
        }
    });
  }

  public selectOnChange(locationNode: LocationNode, selectedLocation: string) {
    let selectedNode = locationNode.options
      .find((location) => location.location === selectedLocation);
    this.myState.setCurrentLocation(selectedNode);
  }

  private updateLocationArr(path: Location[]) {
    for (let i = 0; i < path.length - 1; i++) {
      let selectedLocation = path[i + 1];
      this.locationArr.push({
        selected: selectedLocation,
        selectedValue: selectedLocation.location,
        options: path[i].subLocations
      });
    }
  }
}
