import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { RESOURCE_URLS } from '../../constants/resource-urls';
import { AppUtils } from '../../utils/app-utils';
import { BeehiveClient } from '../helpers/beehive-client.service';
import { ConfigHelper } from '../helpers/config-helper';
import { RequestHelper } from '../helpers/request-helper';
import { BasORM } from '../../orm/orm.service';
import { Thing } from '../../models/thing.interface';
import { ThingResponse } from './interfaces/thing-response.interface';
import { Location } from '../../models/location.interface';

@Injectable()
export class DeviceService {

  constructor(
    private beehiveClient: BeehiveClient,
    private configHelper: ConfigHelper,
    private requestHelper: RequestHelper,
    private _orm: BasORM
  ) { }

  public async getThingsCountByLocation(
    location: Location | string, withSubLocations: boolean = false
  ) {
    let _location = location instanceof Location ? location.location : location;
    let quertRunner = await this._orm.connection
      .driver.createQueryRunner();
    let result: Object[];
    try {
      if (withSubLocations) {
        let queryStr = 'select count(*) as count from thing_location where location like $1';
        result = await quertRunner.query(queryStr, [`${_location}%`]);
      } else {
        let queryStr = 'select count(*) as count from thing_location where location = $1';
        result = await quertRunner.query(queryStr, [_location]);
      }
    } catch (e) {
      console.log(e);
    }
    return result[0]['count'];
  }

  public async getThingsByLocation(location: Location | string, withSubLocations: boolean = false) {
    let devices: Thing[] = [];
    try {
      let query = this._orm.thingRepo
        .createQueryBuilder('thing')
        .innerJoin('thing_location', 'thingLocation', 'thingLocation.thingID = thing.id');

      let _location = location instanceof Location ? location.location : location;

      if (withSubLocations) {
        query = query.where('thingLocation.location LIKE :keyword', { keyword: `${_location}%` });
      } else {
        query = query.where('thingLocation.location = :location', { location: _location });
      }

      devices = await query.getMany();
    } catch (e) {
      console.log(e);
    }
    return devices;
  }

  /**
   * get things by type
   *
   * @param {string} type
   * @returns {Observable<Thing>}
   *
   * @memberOf ThingService
   */
  public async fetchDevicesByType(type: string) {
    let url = this.configHelper.buildUrl(RESOURCE_URLS.TYPE, [type]);
    let requestOptions: RequestOptionsArgs = {};
    let result = await this._orm.thingRepo.find({ type });
    return result;
  }

  /**
   * get device by vendorThingID
   *
   * @param {string} vendorThingID
   * @returns {Observable<Response>}
   *
   * @memberOf DeviceService
   */
  public fetchDeviceByVendorThingID(vendorThingID: string): Observable<Response> {
    let headers: Headers;
    let url = this.configHelper.buildUrl(RESOURCE_URLS.THING, ['vendorThingID', vendorThingID]);
    let requestOptions: RequestOptionsArgs = {};
    return this.beehiveClient.get(url, requestOptions).map((res) => res.json());
  }

  /**
   * get state history by vendorThingID
   *
   * @param {string} vendorThingID
   * @returns {Observable<Response>}
   *
   * @memberOf DeviceService
   */
  public fetchStateHistoryByVendorThingID(vendorThingID: string): Observable<Response> {
    let headers: Headers;
    let url = this.configHelper.buildUrl(RESOURCE_URLS.ES, ['historical']);
    let requestOptions = {
      dateField: 'state.date',
      orderField: 'state.date',
      startDate: 0,
      endDate: AppUtils.now(),
      from: 0,
      order: 'desc',
      size: 20,
      indexType: '192b49ce',
      vendorThingID: vendorThingID
    };
    return this.beehiveClient.post(url, requestOptions).map((res) => res.json());
  }

  /**
   * get command history by globalThingID
   *
   * @param {string} globalThingID
   * @returns {Observable<Response>}
   *
   * @memberOf DeviceService
   */
  public fetchCommandHistoryByGlobalThingID(globalThingID: Number): Observable<Response> {
    let headers: Headers;
    let url = this.configHelper.buildUrl(RESOURCE_URLS.THING_IF, ['command', 'list']);
    let requestOptions = {
      globalThingID: globalThingID,
      start: 0,
      end: AppUtils.now()
    };
    return this.beehiveClient.post(url, requestOptions).map((res) => res.json());
  }

  /**
   * get things
   * subject to remove when sync logic is done
   *
   * @returns {Promise<Thing[]>}
   *
   * @memberOf DeviceService
   */
  public async getAllThings(): Promise<ThingResponse[]> {
    let thingIDs = await this._queryAllDeviceIDs();
    return this._queryDeviceDetailsByIDs(thingIDs.map((id) => id.thingID));
  }

  /**
   * subject to remove when sync logic is done
   *
   * @private
   * @returns
   *
   * @memberOf DeviceService
   */
  private async _queryAllDeviceIDs(): Promise<Array<{ vendorThingID: string; thingID: number }>> {
    let url = this.configHelper.buildUrl(RESOURCE_URLS.REPORTS, ['thingQuery']);
    let body = {
      includeSubLevel: true,
      locationPrefix: ''
    };
    return await this.beehiveClient.post(url, body).map((d) => d.json()).toPromise();
  }

  /**
   * subject to remove when sync logic is done
   *
   * @private
   * @param {number[]} ids
   * @returns
   *
   * @memberOf DeviceService
   */
  private async _queryDeviceDetailsByIDs(ids: number[]) {
    let url = this.configHelper.buildUrl(RESOURCE_URLS.THING, ['queryDetailByIDs']);
    return await this.beehiveClient
      .post(url, ids).map((d) => d.json() as ThingResponse[]).toPromise();
  }
}
