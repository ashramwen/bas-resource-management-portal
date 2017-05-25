import { BMLocation } from './location.interface';

export interface BasArea extends L.Polygon {
  location?: BMLocation;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  polygon?: Array<[number, number]>;
}
