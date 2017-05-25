import { ThingState } from './thing-state.interface';
import { SyncRecord } from './sync_record.interface';
import { Location } from './location.interface';

import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'bas-typeorm';

@Entity('thing')
export class Thing implements SyncRecord {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public createDate: number;

  @Column()
  public modifyDate: number;

  @Column()
  public createBy: string;

  @Column()
  public modifyBy: string;

  @Column()
  public isDeleted: boolean;

  @Column()
  public vendorThingID: string;

  @Column()
  public kiiAppID: string;

  @Column()
  public type: string;

  @Column()
  public fullKiiThingID: string;

  @Column()
  public schemaName: string;

  @Column()
  public schemaVersion: string;

  @Column()
  public kiiThingID: string;

  @Column({type: 'json'})
  public geos: [number, number];

  @ManyToMany((type) => Location, (location) => location.things, {
    cascadeInsert: false, // Allow to insert a new photo on album save
    cascadeUpdate: false, // Allow to update a photo on album save
    cascadeRemove: false  // Allow to remove a photo on album remove
  })
  @Column({type: 'json'})
  public locations: string[];

  public connectivity: any;
  public status: ThingState = {};
}
