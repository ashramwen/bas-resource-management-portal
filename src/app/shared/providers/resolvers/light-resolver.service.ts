import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeviceService } from '../resource-services/device.service';

@Injectable()
export class LightResolver implements Resolve<any> {

  constructor(private deviceService: DeviceService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.deviceService.fetchDeviceByVendorThingID(route.params['id']);
  }
}
