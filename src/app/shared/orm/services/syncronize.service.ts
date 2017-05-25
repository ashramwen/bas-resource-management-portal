import { Injectable } from '@angular/core';
import { Thing } from '../../models/thing.interface';
import { BasORM } from '../orm.service';
import { DeviceService } from '../../providers/resource-services/device.service';
import { LocationType } from '../../models/location-type.interface';
import { Location } from '../../models/location.interface';
import {
  LocationResponse
} from '../../providers/resource-services/interfaces/location-response.interface';
import { SqlHelper } from './sql-helper';
import {
  LocationResourceService
} from '../../providers/resource-services/location-resource.service';
import {
  ThingResponse
} from '../../providers/resource-services/interfaces/thing-response.interface';

export const LOCATION_STORAGE = 'bas-location';

@Injectable()
export class SyncronizeService {

  private _locationsToStore: Location[];

  constructor(
    private _orm: BasORM,
    private _thingService: DeviceService,
    private _locationService: LocationResourceService,
    private _sqlHelper: SqlHelper
  ) { }

  public async sync() {
    let res = await this._orm.thingRepo.count();
    if (res > 0) { return; }
    let locationTypes = await this.syncLocationType();
    let things = await this._thingService.getAllThings();
    await this.syncLocation(locationTypes);
    await this.syncThings(things);
    await this.syncLocationThingMap(things);
  }

  /**
   * sync things to local db, subject to be replaced when sync logic is done
   *
   * @private
   * @returns
   *
   * @memberOf SyncronizeService
   */
  private async syncThings(things: ThingResponse[]) {
    // tend to use timestamp instead after sync logic is done
    let thingRepo = this._orm.connection.getRepository(Thing);
    let result = await thingRepo.findAndCount();
    if (result[1] !== 0) { return; }

    let columns = [
      'id', 'createDate', 'modifyDate',
      'createBy', 'modifyBy', 'isDeleted', 'vendorThingID',
      'kiiAppID', 'type', 'fullKiiThingID', 'schemaName',
      'schemaVersion', 'kiiThingID', 'locations', 'geos'
    ];

    let rows = things
      .map((t) => [
        t.id, t.createDate, t.modifyDate,
        t.createBy, t.modifyBy, t.isDeleted, t.vendorThingID,
        t.kiiAppID, t.type, t.fullKiiThingID, t.schemaName,
        t.schemaVersion, t.kiiThingID, this._parseLocation(t.locations), this._randomLocation()
      ]);
    await this._sqlHelper.insertMultiRows('thing', columns, rows);
  }

  private _parseLocation(locations: string[]) {
    return !locations ? '' : JSON.stringify(locations.map((l) => '.' + l));
  }

  private _randomLocation() {
    let bounds = {
      left: 120.02315640449524,
      right: 120.02470940351488,
      top: 30.28120842772592,
      bottom: 30.280221699823382
    };

    let left = bounds.left + (bounds.right - bounds.left) * Math.random();
    let top = bounds.top + (bounds.bottom - bounds.top) * Math.random();
    return JSON.stringify([top, left]);
  }

  /**
   * sync locations, subject to be replaced when sync logic done
   *
   * @private
   * @param {LocationType[]} locationTypes
   *
   * @memberOf SyncronizeService
   */
  private async syncLocation(locationTypes: LocationType[]) {
    let locationRepo = this._orm.connection.getRepository(Location);
    let locationTree = await this._locationService
      .fetchLocations().toPromise();
    let result = await locationRepo.findOne({location: '.'});
    if (result) { return; }

    let geos = await this._locationService.getBuildingsGeo().toPromise();
    this._locationsToStore = [];
    this.restructureLocation(locationTree, null, locationTypes);

    this._locationsToStore.forEach((d) => {
      let res = geos.find((g) => ('.' + g.properties.tag) === d.location);
      if (res && res.geometry && res.geometry.coordinates) {
        d.geoPolygon = JSON.stringify(res.geometry.coordinates);
      } else {
        d.geoPolygon = '';
      }
    });

    let columns = [
      'id', 'createDate', 'modifyDate', 'createBy',
      'modifyBy', 'isDeleted', 'location', 'geoPolygon', 'displayNameCN',
      'displayNameEN', 'order', 'parentID', 'locationType'
    ];
    let rows = this._locationsToStore
      .reverse()
      .map((d) => [
        d.id, d.createDate, d.modifyDate, d.createBy,
        d.modifyBy, d.isDeleted, d.location, d.geoPolygon, d.displayNameCN,
        d.displayNameEN, d.order, d.parentID, d.locationType.id
      ]);

    await this._sqlHelper.insertMultiRows('location', columns, rows);
  }

  /**
   * sync location type, subject to be replaced when sync logic is done.
   *
   * @private
   * @returns
   *
   * @memberOf SyncronizeService
   */
  private async syncLocationType() {
    let locationTypeRes = this._locationService.fetchLocationTypes();
    let locationTypeRepo = this._orm.connection.getRepository(LocationType);
    return await locationTypeRepo.persist(locationTypeRes.map((typeRes) => {
      let _t = new LocationType();
      Object.assign(_t, typeRes);
      return _t;
    }));
  }

  private async syncLocationThingMap(things: ThingResponse[]) {
    let records = things.reduce((results, thing) => {
      let thingLocations = thing.locations.map((location) => ['.' + location, thing.id]);
      return results.concat(thingLocations);
    }, [] as any[][]);
    let columns = ['location', 'thingID'];
    await this._sqlHelper.insertMultiRows('thing_location', columns, records);
  }

  /**
   * restructure beehive location tree to fit bas location data structure
   * subject to be replaced when relevant api is done.
   *
   * @private
   * @param {LocationResponse} locationResponse
   * @param {Location} parent
   * @param {LocationType[]} locationTypes
   * @returns
   *
   * @memberOf SyncronizeService
   */
  private restructureLocation(
    locationResponse: LocationResponse,
    parent: Location,
    locationTypes: LocationType[],
    sequence: number = 0,
  ) {
    let location = new Location();
    Object.assign(location, locationResponse, {
      id: this._locationsToStore.length,
      parent: parent,
      order: 0,
      description: {
        displayNameCN: locationResponse.location.substr(locationResponse.location.length - 2, 2),
        displayNameEN: locationResponse.location.substr(locationResponse.location.length - 2, 2)
      },
      location: locationResponse.location === '.' ? '.' : '.' + locationResponse.location,
      createDate: 0,
      modifyDate: 0,
      createBy: 0,
      modifyBy: 0,
      isDeleted: 0,
      geoPolygon: '',
      level: sequence,
      parentID: !parent ? 'NULL' : parent.id
    });
    switch (locationResponse.locationLevel) {
      case undefined:
        location.locationType = locationTypes.find((t) => t.level === 1);
        break;
      case 'building':
        location.locationType = locationTypes.find((t) => t.level === 2);
        location.displayNameCN += '楼';
        break;
      case 'floor':
        location.locationType = locationTypes.find((t) => t.level === 3);
        location.displayNameCN += '层';
        break;
      case 'partition':
        location.locationType = locationTypes.find((t) => t.level === 4);
        location.displayNameCN += '区块';
        break;
      case 'area':
        location.locationType = locationTypes.find((t) => t.level === 5);
        location.displayNameCN += '区域';
        break;
      case 'site':
        location.locationType = locationTypes.find((t) => t.level === 6);
        location.displayNameCN += '工位';
        break;
      default:
        break;
    }
    this._locationsToStore.push(location);

    location.subLocations = Object.keys(locationResponse.subLocations)
      .map((key) => {
        return this.restructureLocation(
          locationResponse.subLocations[key], location, locationTypes, sequence + 1);
      })
      .sort((a, b) => {
        return a.location < b.location ? -1 : 1;
      });

    return location;
  }
}
