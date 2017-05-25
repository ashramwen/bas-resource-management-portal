import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { BasORM } from '../../orm/orm.service';
import { SyncronizeService } from '../../orm/services/syncronize.service';
import { RootState } from '../../redux/index';
import { StateSelectors } from '../../redux/selectors';
import { MetaInitSuccessAction, AddLocationAction } from '../../redux/global/actions';
import { ShowAppSpinnerAction, HideAppSpinnerAction } from '../../redux/layout/actions';
import {
  CanActivate, CanActivateChild,
  ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras
} from '@angular/router';
import { Location } from '../../models/location.interface';
import { Repository } from 'bas-typeorm';
import { LocationService } from '../resource-services/location.service';

@Injectable()
export class MetaGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private _orm: BasORM,
    private _sycnService: SyncronizeService,
    private _locationSerevice: LocationService,
    private store: Store<RootState>
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkSyncState();
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  private checkSyncState(): Promise<boolean> {
    return new Promise((resolve) => {
      this.store.select(StateSelectors.global).subscribe(async (globalState) => {
        try {
          if (globalState.metaInited) { return true; }
          this.store.dispatch(new ShowAppSpinnerAction());
          if (!this._orm.connection) {
            await this._orm.init();
          }
          await this._sycnService.sync();
          await this._locationSerevice.init();
          this.store.dispatch(new MetaInitSuccessAction());
          resolve(true);
        } catch (e) {
          console.log(e);
          resolve(false);
        } finally {
          this.store.dispatch(new HideAppSpinnerAction());
        }
      });
    });
  }
}
