import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';

import { ConfigHelper } from '../helpers/config-helper';
import { RequestHelper } from '../helpers/request-helper';
import { RESOURCE_URLS } from '../../constants/resource-urls';
import { Observable } from 'rxjs';
import { BeehiveClient } from '../helpers/beehive-client.service';
import { LocationTypeResponse } from './interfaces/location-type-response.interface';
import { LocationResponse } from './interfaces/location-response.interface';
import { Building, AreaFeature } from '../../models/building.interface';

@Injectable()
export class LocationResourceService {

  constructor(
    private http: BeehiveClient,
    private configHelper: ConfigHelper,
    private requestHelper: RequestHelper,
  ) { }

  /**
   * @desc get locations
   * @return {Observable<Response>} location Observable
   */
  public fetchLocations(): Observable<LocationResponse> {
    let headers: Headers;
    let url = this.configHelper.buildUrl(RESOURCE_URLS.LOCATION_TAGS, ['fullTree']);
    let requestOptions: RequestOptionsArgs = {};

    return this.http
      .get(url, requestOptions).map((d) => d.json() as LocationResponse);
  }

  public getBuildingsGeo(): Observable<AreaFeature[]> {
    return this.http.get('./assets/mock-data/new.geojson')
      .map((r) => {
        return r.json() as AreaFeature[];
      })
      .map((features) => {
        features.forEach((f) => {
          f.geometry.coordinates[0]
            .forEach((point) => {
              let temp = point[1];
              point[1] = point[0];
              point[0] = temp;
            });
        });
        return features;
      });
  }

  /**
   * subject to remove when sync logic is done.
   *
   * @returns {LocationTypeResponse[]}
   *
   * @memberOf LocationService
   */
  public fetchLocationTypes(): LocationTypeResponse[] {
    return [{
      id: 1,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 1,
      expendAll: true,
      description: {
        displayNameCN: '',
        displayNameEN: ''
      }
    }, {
      id: 2,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 2,
      expendAll: false,
      description: {
        displayNameCN: '楼',
        displayNameEN: ''
      }
    }, {
      id: 3,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 3,
      expendAll: true,
      description: {
        displayNameCN: '层',
        displayNameEN: ''
      }
    }, {
      id: 4,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 4,
      expendAll: true,
      description: {
        displayNameCN: '片区',
        displayNameEN: ''
      }
    }, {
      id: 5,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 5,
      expendAll: true,
      description: {
        displayNameCN: '区域',
        displayNameEN: ''
      }
    }, {
      id: 6,
      createDate: 0,
      modifyDate: 0,
      createBy: '',
      modifyBy: '',
      isDeleted: false,
      level: 6,
      expendAll: true,
      description: {
        displayNameCN: '工位',
        displayNameEN: ''
      }
    }];
  }
}
