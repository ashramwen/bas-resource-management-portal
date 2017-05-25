
import { ThingState } from './thing-state.interface';
import { SyncRecord } from './sync_record.interface';
import { Location } from './location.interface';

import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'bas-typeorm';

@Entity('locationType')
export class LocationType implements SyncRecord {

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
  public level: number;

  @Column()
  public displayNameCN: string;

  @Column()
  public displayNameEN: string;

  @Column()
  public expendAll: boolean;

  @OneToMany((type) => Location, (location) => location.locationType)
  public locations: Location[];

  set description(value) {
    this.displayNameCN = value['displayNameCN'];
    this.displayNameEN = value['displayNameEN'];
  }

}
