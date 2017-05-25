import { Injectable } from '@angular/core';
import {
  Http,
  ConnectionBackend,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  Response,
  Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../../redux/index';
import { Store } from '@ngrx/store';
import { ClearAction } from '../../redux/token/actions';
import { RequestHelper } from './request-helper';
import { StateSelectors } from '../../redux/selectors';
import { of } from 'rxjs/observable/of';

@Injectable()
export class BeehiveClient extends Http {

  constructor(
    _backend: ConnectionBackend,
    _requestOpt: RequestOptions,
    private store: Store<RootState>,
    private requestHelder: RequestHelper,
  ) {
    super(_backend, _requestOpt);
  }

  public request(url: string | Request, options: RequestOptionsArgs = {}): Observable<Response> {

    let beehiveHeaders = this.beehiveHeaders;
    let requestOptions = url instanceof String ? options : url;

    requestOptions.headers = requestOptions.headers ?
      this.requestHelder.mergeHeaders([requestOptions.headers, beehiveHeaders]) :
      beehiveHeaders;

    return super.request(url, requestOptions)
      .catch((res) => {
        if (res.status === 401) {
          this.store.dispatch(new ClearAction());
          return null;
        }
        return Observable.throw(res);
      });
  }

  private get beehiveHeaders() {
    let beehiveHeaders: Headers;

    if (this.loggedIn) {
      this.requestHelder.headersWithToken
        .subscribe((headers) => {
          beehiveHeaders = headers;
        });
    } else {
      this.requestHelder.headers
        .subscribe((headers) => {
          beehiveHeaders = headers;
        });
    }

    return beehiveHeaders;
  }

  private get loggedIn(): boolean {
    let loggedIn: boolean = false;
    this.store.select(StateSelectors.token).subscribe((token) => {
      loggedIn = token ? token.loggedIn : false;
    });

    return loggedIn;
  }
}
