import { SyncRecord } from './sync_record.interface';
import { LocationType } from './location-type.interface';
import { Thing } from './thing.interface';
import {
  ConnectionOptions,
  createConnection,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Index,
  ManyToMany,
  JoinTable
} from 'bas-typeorm';

// export type LocationLevel = undefined | 'building' | 'floor' | 'partition' | 'area' | 'site';

// export interface Location {
//   location: string;
//   locationName: string;
//   locationLevel: LocationLevel;
//   parent: Location;
//   fullName: string;
//   subLocations: Location[];
// }

@Entity('location')
@Index('location_index', ['location'])
@Index('parent_id_index', ['parentID'])
@Index('location_type_index', ['locationType'])
export class Location implements SyncRecord {
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
  public location: string;

  @Column()
  public geoPolygon: string;

  @Column()
  public displayNameCN: string;

  @Column()
  public displayNameEN: string;

  @Column()
  public order: number;

  @Column()
  public level: number;

  @ManyToOne((type) => Location, (location) => location.subLocations)
  @Column()
  public parentID: number;

  @OneToMany((type) => Location, (location) => location.parentID)
  public subLocations: Location[];

  @ManyToOne((type) => LocationType, (locationType) => locationType.locations)
  public locationType: LocationType;

  @ManyToMany((type) => Thing, (thing) => thing.locations, {
    cascadeInsert: false, // Allow to insert a new photo on album save
    cascadeUpdate: false, // Allow to update a photo on album save
    cascadeRemove: false  // Allow to remove a photo on album remove
  })
  @JoinTable({
    name: 'thing_location',
    joinColumn: {
      name: 'location',
      referencedColumnName: 'location'
    },
    inverseJoinColumn: {
      name: 'thingID',
      referencedColumnName: 'id'
    }
  })
  public things: Thing[];

  public set description(value) {
    if (!value) {
      this.displayNameCN = '';
      this.displayNameEN = '';
    } else {
      this.displayNameCN = value['displayNameCN'];
      this.displayNameEN = value['displayNameEN'];
    }
  }

  public get geos(): Array< Array<[number, number]>> {
    return !!this.geoPolygon ?
      JSON.parse(this.geoPolygon) : [];
  }

  public parent: Location;
}
