import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { Thing } from './../../models/thing.interface';
import { DeviceService } from '../resource-services/device.service';

@Injectable()
export class LightsResolver implements Resolve<Thing[]> {

  constructor(private deviceService: DeviceService) { }

  public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await this.deviceService.fetchDevicesByType('Lighting');
  }
}
