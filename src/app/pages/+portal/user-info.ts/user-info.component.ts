import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { MdDialog } from '@angular/material';

import { RootState } from '../../../shared/redux/index';
import { LogOutAction } from '../../../shared/redux/token/actions';
import { PasswordChangeCmp } from './password-change/password-change.component';
import {
  GoMainAction, ShowAppSpinnerAction, HideAppSpinnerAction
} from '../../../shared/redux/layout/actions';
import { BasORM } from '../../../shared/orm/orm.service';
import { SyncronizeService } from '../../../shared/orm/services/syncronize.service';
import {
  AlertModal,
  ConfirmModal
} from 'kii-universal-ui';

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoCmp {

  constructor(
    private store: Store<RootState>,
    private dialog: MdDialog,
    private confirm: ConfirmModal,
    private _orm: BasORM,
    private _syncService: SyncronizeService,
    private _alert: AlertModal
  ) { }

  public logout() {
    let result = this.confirm.open({
      message: `Are you sure to logout?`,
      callback: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          });
        });
      }
    });

    result.ok.subscribe(() => {
      this.store.dispatch(new LogOutAction());
    });
  }

  public goMain() {
    this.store.dispatch(new GoMainAction());
  }

  public openChangePasswordDialog() {
    let dialogRef = this.dialog.open(PasswordChangeCmp, {
      width: '300px',
    });
    dialogRef.componentInstance.close.subscribe(() => {
      dialogRef.close();
    });
  }

  public refreshLocalData() {
    let result = this.confirm.open({
      message: `Are you sure to refresh data?`,
    });

    result.ok.subscribe(async () => {
      try {
        this.store.dispatch(new ShowAppSpinnerAction());
        await this._orm.connection.syncSchema(true);
        await this._syncService.sync();
        this._alert.success(`Data Syncronized Successfully, Will Reload the Application.`);
        setTimeout(() => {
          history.go(0);
        }, 2);
      } catch (e) {
        this._alert.failure(`Syncronic Failed, reason: ${e.message}`);
      } finally {
        this.store.dispatch(new HideAppSpinnerAction());
      }
    });
  }
}
