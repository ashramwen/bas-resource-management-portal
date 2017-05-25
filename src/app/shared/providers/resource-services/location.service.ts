import { Injectable } from '@angular/core';
import { BasORM } from '../../orm/orm.service';
import { Location } from '../../models/location.interface';
import * as _ from 'lodash';
import { LOCATION_STORAGE } from '../../orm/services/syncronize.service';

@Injectable()
export class LocationService {

  private _locations: Location[];

  constructor(
    private _orm: BasORM
  ) { }

  public async init() {
    let queryRunner = await this._orm.connection.driver.createQueryRunner();
    let query = `select * from location order by location.location`;
    let result: any[] = await queryRunner.query(query);
    this._locations = result.map((r) => {
      let location = new Location();
      Object.assign(location, r);
      return location;
    });
    let root = await this.root;
    root.subLocations = [];
    this._buildTree(root, this._locations.slice(1, this._locations.length));
  }

  public get root() {
    return this.getLocation('.');
  }

  public async getDescendants(location: string) {
    let repo = this._orm.locationRepo;
    return await repo.createQueryBuilder('location')
      .where('location.location LIKE :keyword', { keyword: `${location}%` })
      .getMany();
  }

  public async getLocation(location: string) {
    return await this._locationSelectors
      .where('location.location=:location')
      .addParameters({ location })
      .getOne();
  }

  public async getSubLocations(location: Location) {
    return await this._locationSelectors
      .where('location.parentID=:id')
      .addParameters({ id: location.id })
      .getMany();
  }

  public async getParentLocation(location: Location) {
    return await this._locationSelectors
      .where('location.id=:id')
      .addParameters({ id: location.parentID })
      .getOne();
  }

  public async getLocationPath(
    location: Location | string
  ): Promise<Location[]> {
    try {
      if (!location) { return []; }
      let _location: string = _.isString(location) ? location : location.location;
      let myLocation = this._locations.find((l) => l.location === _location);

      let path = [];
      let _cursor = myLocation;
      while (_cursor) {
        path.push(_cursor);
        _cursor = _cursor.parent;
      }
      path.reverse();
      return path;
    } catch (e) {
      console.log(e);
    }
  }

  public async isCascade(location: Location) {
    return await this._orm.locationRepo
      .createQueryBuilder('location')
      .innerJoin('locationType', 'locationType', 'locationType.id = location.locationType')
      .where(`locationType.expendAll = 0 
        and location.location LIKE (:location || "%")`, { location: location.location })
      .getCount() > 0;
  }

  public async isLeaf(location: Location) {
    let subLocations = await this.getSubLocations(location);
    return !subLocations.length;
  }

  private get _locationSelectors() {
    return this._orm.locationRepo
      .createQueryBuilder('location')
      .innerJoinAndSelect('location.locationType', 'locationType')
      .leftJoinAndSelect('location.subLocations', 'subLocations')
      .orderBy('`subLocations_order`', 'DESC');
  }

  private _buildTree(location: Location, locations: Location[]) {
    location.subLocations = location.subLocations || [];
    while (true) {
      if (locations[0] && locations[0].parentID === location.id) {
        let subLocation = locations[0];
        location.subLocations.push(locations[0]);
        locations.splice(0, 1);
        subLocation.parent = location;
        this._buildTree(subLocation, locations);
      } else {
        break;
      }
    }
  };
}
