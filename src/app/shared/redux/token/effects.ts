import { Action, Store } from '@ngrx/store';
import {
  ActionTypes,
  ClearAction,
  LoadAction,
  LoadFailureAction,
  LoadSuccessAction,
  LogOutAction,
  StoreAction,
  StoreSuccessAction,
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
export class TokenEffects {

  @Effect()
  public load$: Observable<Action> = this.actions$
    .ofType(ActionTypes.LOAD)
    .startWith(new LoadAction())
    .switchMap(() => {
      return Observable.of(this.localStorage.get(LOCAL_STORAGE_KEYS.TOKEN))
        .map((token: Token) => {
          if (token) {
            return new LoadSuccessAction(token);
          } else {
            return new LoadFailureAction();
          }
        });
    });

  @Effect()
  public store$: Observable<Action> = this.actions$
    .ofType(ActionTypes.STORE)
    .map(toPayload)
    .switchMap((token: Token) => {
      this.localStorage.set(LOCAL_STORAGE_KEYS.TOKEN, token);
      return Observable.of(new StoreSuccessAction())
        .delay(0);
    });

  @Effect()
  public loginSuccess$: Observable<Action> = this.actions$
    .ofType(ActionTypes.LOGIN_SUCCESS)
    .map(toPayload)
    .switchMap((token: Token) => {
      return Observable
        .of(new StoreAction(token))
        .delay(0);
    });

  @Effect()
  public logout$: Observable<Action> = this.actions$
    .ofType(ActionTypes.LOGOUT)
    .switchMap(() => {
      this.stomp.disconnect();
      this.store.dispatch(new GoMainAction());
      this.session.logout()
        .map(() => new ClearAction())
        .delay(0);
      return Observable.of(new ClearAction()).delay(0);
    });

  @Effect()
  public clear$: Observable<Action> = this.actions$
    .ofType(ActionTypes.CLEAR)
    .switchMap(() => {
      this.store.dispatch(go(['/login']));
      this.localStorage.clearAll();
      return Observable.of();
    });

  constructor(
    private actions$: Actions,
    private localStorage: LocalStorageService,
    private session: SessionService,
    private store: Store<RootState>,
    private stomp: StompService
  ) { }
}
