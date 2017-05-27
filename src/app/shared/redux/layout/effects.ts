import { Action, Store } from '@ngrx/store';
import {
  ActionTypes,
} from './actions';
import { Actions, Effect, toPayload } from '@ngrx/effects';

import { GoMainAction } from '../layout/actions';
import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from '../../constants/local-storage';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../index';
import { SessionService } from '../../providers/session.service';
import { StompService } from './../../providers/stomp.service';
import { Token } from '../../models/token.interface';
import { empty } from 'rxjs/observable/empty';
import { go } from '@ngrx/router-store';
import { of } from 'rxjs/observable/of';

@Injectable()
export class LayoutEffects {

  /**
   * this helps to trigger resize event when side nav is toggled.
   */
  @Effect()
  public load$: Observable<Action> = this.actions$
    .ofType(ActionTypes.TOGGLE_SIDE_NAV)
    .do(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    })
    .switchMap(() => {
      return Observable.of({});
    });

  constructor(
    private actions$: Actions,
  ) { }
}
