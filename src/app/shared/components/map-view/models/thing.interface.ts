import { Thing } from '../../../models/thing.interface';

export class BMThing extends Thing {
  public selected?: boolean;
  public disabled?: boolean;
  public highlighted?: boolean;
}
