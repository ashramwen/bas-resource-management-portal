import { BMThing } from './thing.interface';

export interface BasMarker extends L.Marker {
  device?: BMThing;
  selected?: boolean;
  highlighted?: boolean;
}
