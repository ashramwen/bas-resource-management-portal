import { BMLocation } from '../../map-view/models/location.interface';

export interface LocationWithPath {
  location: BMLocation;
  path: BMLocation[];
}
