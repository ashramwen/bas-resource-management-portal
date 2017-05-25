import { Actions, ActionTypes, MetaInitSuccessAction, AddLocationAction } from './actions';
import { Location } from '../../models/location.interface';

export interface GlobalState {
  metaInited?: boolean;
  locations?: Location;
};

export const initialState: GlobalState = {
  metaInited: false,
  locations: null,
};

export function globalReducer(state = initialState, action: Actions): GlobalState {
  switch (action.type) {
    case ActionTypes.META_INIT_SUCCESS: {
      return onMetaInitedSuccess(state, <MetaInitSuccessAction> action);
    }
    case ActionTypes.ADD_LOCATION: {
      return onAddLocationAction(state, <AddLocationAction> action);
    }
    default: {
      return state;
    }
  }
}

function onMetaInitedSuccess(state: GlobalState, action: MetaInitSuccessAction): GlobalState {
  return Object.assign({}, state, {
    metaInited: true
  } as GlobalState);
}

function onAddLocationAction(state: GlobalState, action: AddLocationAction): GlobalState {
  return Object.assign({}, state, {
    locations: action.payload
  });
}
