import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Credential } from '../models/credential.interface';
import { ConfigHelper } from './helpers/config-helper';
import { RESOURCE_URLS } from '../constants/resource-urls';
import { RequestHelper } from './helpers/request-helper';
import { Observable } from 'rxjs/Observable';
import { BeehiveClient } from './helpers/beehive-client.service';

@Injectable()
export class SessionService {

  constructor(
    private http: BeehiveClient,
    private configHelper: ConfigHelper,
    private requestHelper: RequestHelper
  ) { }

  public login(credential: Credential) {
    let url = this.configHelper.buildUrl(RESOURCE_URLS.AUTH, ['login']);
    let requestOptions: RequestOptionsArgs = {};

    return this.http
      .post(url, credential, requestOptions);
  }

  public logout() {
    return Observable.of().delay(0);
  }
}
