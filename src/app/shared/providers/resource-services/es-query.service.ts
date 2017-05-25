import { ESCount, ESResponse } from '../../models/es-response.interface';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ESObject } from '../../models/es-object';
import { ESQueryOption } from '../../models/es-query-option.interface';

const SEARCH_URL = `${BASE_CONFIG.esUrl}${BASE_CONFIG.kiiAppID}/_search`;
const COUNT_URL = `${BASE_CONFIG.esUrl}${BASE_CONFIG.kiiAppID}/_count`;

@Injectable()
export class EsQueryService {

  private options: RequestOptions;

  constructor(
    private http: Http
  ) {
    let headers = new Headers({ Authorization: 'Bearer super_token' });
    this.options = new RequestOptions({ headers: headers });
  }

  public searchES(esObject: ESObject): Observable<any> {
    return this.http.post(SEARCH_URL, esObject, this.options)
      .map((r: Response) => r.json() as ESResponse)
      .catch(this.handleError);
  }

  public countES(esObject: ESObject): Observable<any> {
    return this.http.post(COUNT_URL, esObject, this.options)
      .map((r: Response) => r.json() as ESCount)
      .catch(this.handleError);
  }

  public query(esQueryOption: ESQueryOption): Observable<ESResponse> {
    let esObject = new ESObject(esQueryOption);
    return this.searchES(esObject);
  }

  public count(esQueryOption: ESQueryOption): Observable<ESCount> {
    let esObject = new ESObject(esQueryOption);
    return this.countES(esObject);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
