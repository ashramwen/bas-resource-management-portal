import { Injectable } from '@angular/core';
import { Location } from '../../../../shared/models/location.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BRLocationListViewService {
  public currentLocationChanged = new Subject();
  private _currentLocation: Location = null;

  public get currentLocation(): Location {
    return this._currentLocation;
  }

  public set currentLocation(value) {
    this._currentLocation = value;
    this.currentLocationChanged.next(value);
  }
}
