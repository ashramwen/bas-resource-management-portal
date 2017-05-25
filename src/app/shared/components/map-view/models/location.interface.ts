import { Location } from '../../../models/location.interface';

export interface BMLocation extends Location {
  selected?: boolean;
  disabled?: boolean;
  highlighted?: boolean;
}
