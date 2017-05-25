import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';

import { RootState } from '../../../../shared/redux/index';
import { Thing } from '../../../../shared/models/thing.interface';
import {
  DeviceDetailCmp,
  DeviceDetailInputData
} from './device-detail/device-detail.component';
import { DeviceService } from '../../../../shared/providers/resource-services/device.service';
import {
  PortalModal
} from 'kii-universal-ui';

@Component({
  selector: 'bas-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListCmp implements OnInit {

  public lightings: Thing[];

  constructor(
    private route: ActivatedRoute,
    private store: Store<RootState>,
    private deviceService: DeviceService,
    private router: Router,
    private portalModal: PortalModal
  ) { }

  public deviceDetail(item: Thing) {
    console.log('go device detail');
    // this.store.dispatch(go(['/portal/device-list', item.vendorThingID]));
    // this.router.navigate(['/portal/device-list', item.vendorThingID]);
    let data: DeviceDetailInputData = {
      thing: item
    };

    this.portalModal.show(DeviceDetailCmp, data);
  }

  public ngOnInit() {
    this.lightings = this.route.snapshot.data['lightings'];
  }
}
