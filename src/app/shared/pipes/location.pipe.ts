import { Pipe, PipeTransform } from '@angular/core';
import { LocationService } from '../providers/resource-services/location.service';
import { Location } from '../models/location.interface';

@Pipe({
  name: 'location',
})
export class LocationPipe implements PipeTransform {

  constructor(
    private _locationService: LocationService
  ) { }

  public async transform(value: string | string[] | Location) {

    // :: todo
    // check app language
    let field = 'displayNameCN';

    if (value instanceof Location) {
      value = [value.location];
    } else if (typeof value === 'string') {
      value = [value];
    }
    let $locations = value.map(async (location) => {
      let path = await this._locationService.getLocationPath(location);

      return path.slice(1, path.length).map((l) => l[field]).join(' ');
    });
    let locNames = await Promise.all($locations);
    return locNames.join(',');
  }
}
