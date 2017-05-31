import { BMLocation } from '../../../../../shared/components/map-view/models/location.interface';

export interface LocationWithPath {
  location: BMLocation;
  path: BMLocation[];
}
