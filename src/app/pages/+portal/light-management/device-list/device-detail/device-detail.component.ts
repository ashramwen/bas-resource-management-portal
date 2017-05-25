import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Thing } from '../../../../../shared/models/thing.interface';
import { DeviceService } from '../../../../../shared/providers/resource-services/device.service';
import {
  PortalModalRef
} from 'kii-universal-ui';

export interface DeviceDetailInputData {
  thing: Thing;
}

@Component({
  selector: 'bas-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailCmp implements OnInit {
  public commandHistory: Object[];
  public stateHistory: Object[];

  public thing: Thing;

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private portalModalRef: PortalModalRef<DeviceDetailInputData>
  ) {
    this.thing = portalModalRef.data.thing;
  }

  public getProfile() {
    console.log();
  }

  public getCommandHistory() {
    this.commandHistory = [];
    this.deviceService.fetchCommandHistoryByGlobalThingID(this.thing.id)
      .subscribe((history: any) => {
        this.commandHistory = history;
        console.log('command history', this.commandHistory);
      });
  }

  public getStateHistory() {
    this.stateHistory = [];
    this.deviceService.fetchStateHistoryByVendorThingID(this.thing.vendorThingID)
      .subscribe((history: any) => {
        this.stateHistory = history;
        console.log('state history', this.stateHistory);
      });
  }

  public ngOnInit() {
    this.commandHistory = [];
    this.deviceService.fetchCommandHistoryByGlobalThingID(this.thing.id)
      .subscribe((history: any) => {
        history.map((object) => {
          object.power = null;
          object.brightness = null;
          object.actions.forEach((action) => {
            action.turnPower ?
              object.power = action.turnPower.Power :
              object.brightness = action.setBri.Bri;
          });
          console.log('object', object);
        });
        this.commandHistory = history;
        console.log('command history', this.commandHistory);
      });
    this.stateHistory = [];
    this.deviceService.fetchStateHistoryByVendorThingID(this.thing.vendorThingID)
      .subscribe((history: any) => {
        this.stateHistory = history.hits.map((object) => object._source.state);
        console.log('state history', this.stateHistory);
      });
  }
}
