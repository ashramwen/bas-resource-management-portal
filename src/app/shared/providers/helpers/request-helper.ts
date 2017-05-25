import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Store } from '@ngrx/store';
import { RootState } from '../../redux';
import { TokenState } from '../../redux/token/reducer';
import { Observable } from 'rxjs/Observable';
import { StateSelectors } from '../../redux/selectors';

@Injectable()
export class RequestHelper {

  constructor(
    private store: Store<RootState>
  ) { }

  /**
   * @description get bas fixed headers
   */
  public get headers(): Observable<Headers> {
    let headers = new Headers({
      'content-type': 'application/json'
    });

    return Observable.of(headers);
  }

  /**
   * @description get BAS fixed headers with auth token
   */
  public get headersWithToken() {
    return this.store.select(StateSelectors.token)
      .map((tokenState: TokenState) => {
        let headers = new Headers({
          authorization: `Bearer ${tokenState.token.accessToken}`
        });
        return headers;
      })
      .zip(this.headers)
      .map(this.mergeHeaders);
  }

  public mergeHeaders(headersArr: Headers[]): Headers {
    let newHeaders = new Headers();

    headersArr.forEach((header) => {
      header.forEach((values, name) => {
        values.forEach((value) => {
          newHeaders.append(name, value);
        });
      });
    });

    return newHeaders;
  }
}
