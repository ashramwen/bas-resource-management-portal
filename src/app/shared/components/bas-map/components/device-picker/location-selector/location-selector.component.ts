import { Component, Input, Output } from '@angular/core';
import { Location } from '../../../../../models/location.interface';
import { LocationSelector } from '../../../providers/location-selector.service';

@Component({
  selector: 'bm-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorCmp {
  @Input() public locations: Location[];

  constructor(
    private layerSelector: LocationSelector,
  ) { }

  public remove(location: Location) {
    this.layerSelector.deselectLocation(location);
  }
}
