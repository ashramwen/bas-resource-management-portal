import { type } from '../utils';
import { Action } from '@ngrx/store';
import { Credential } from '../../models/credential.interface';
import { Observable } from 'rxjs/Observable';
import { Location } from '../../models/location.interface';

export const ActionTypes = {
  META_INIT_SUCCESS: type('[Global] META_INIT_SUCCESS'),
  ADD_LOCATION: type('[Global] ADD_LOCATION'),
};

export class MetaInitSuccessAction implements Action {
  public type = ActionTypes.META_INIT_SUCCESS;
}

export class AddLocationAction implements Action {
  public type = ActionTypes.ADD_LOCATION;

  constructor(
    public payload: Location
  ) { }
}

export type Actions =
  MetaInitSuccessAction |
  AddLocationAction;
