import { Thing } from '../models/thing.interface';
import { Location } from '../models/location.interface';

import { Injectable } from '@angular/core';
import { SyncronizeService } from './services/syncronize.service';
import { LocationType } from '../models/location-type.interface';
import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Connection
} from 'bas-typeorm';

let options: ConnectionOptions = {
  driver: {
    type: 'websql',
    database: 'basdb',
    extra: {
      version: 1,
      description: 'BAS local database',
      size: 50 * 1024 * 1024
    }
  },
  entities: [
    Thing,
    LocationType,
    Location
  ],
  autoSchemaSync: true
};

@Injectable()
export class BasORM {
  public connection: Connection = null;

  public get thingRepo() {
    return this.connection.getRepository(Thing);
  }

  public get locationRepo() {
    return this.connection.getRepository(Location);
  }

  public async init() {
    try {
      this.connection = await createConnection(options);
      console.log('db connected!');
    } catch (error) {
      console.error(`Connection Error ${JSON.stringify(error)}`);
    }
  }
}
