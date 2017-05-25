import { Location } from '../../models/location.interface';
import {
  Actions,
  ActionTypes,
  ShowSideNavAction,
  ToggleSideNavAction,
  HideSideNavAction,
  ShowLoadingAction,
  HideLoadingAction,
  GoUserInfoAction,
  GoMainAction
} from './actions';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ShowAppSpinnerAction, HideAppSpinnerAction } from './actions';

export interface LayoutState {
  sideMenuVisible?: boolean;
  loading?: number;
  swipeTabIndex?: number;
  appSpinnerVisible?: boolean;
};

export const initialState: LayoutState = {
  sideMenuVisible: false,
  loading: 0,
  swipeTabIndex: 0,
  appSpinnerVisible: false,
};

export function layoutReducer(state = initialState, action: Actions): LayoutState {
  switch (action.type) {
    case ActionTypes.SHOW_SIDE_NAV: {
      return onShowSideNavAction(state, <ShowSideNavAction> action);
    }
    case ActionTypes.HIDE_SIDE_NAV: {
      return onHideSideNavAction(state, <HideSideNavAction> action);
    }
    case ActionTypes.TOGGLE_SIDE_NAV: {
      return onToggleSideNavAction(state, <ToggleSideNavAction> action);
    }
    case ActionTypes.SHOW_LOADING: {
      return onShowLoading(state, <ShowLoadingAction> action);
    }
    case ActionTypes.HIDE_LOADING: {
      return onHideLoading(state, <HideLoadingAction> action);
    }
    case ActionTypes.GO_MAIN: {
      return onGoMain(state, <GoMainAction> action);
    }
    case ActionTypes.GO_USER_INFO: {
      return onGoUserInfo(state, <GoUserInfoAction> action);
    }
    case ActionTypes.SHOW_APP_SPINNER: {
      return onShowAppSpinner(state, <ShowAppSpinnerAction> action);
    }
    case ActionTypes.HIDE_APP_SPINNER: {
      return onHideAppSpinner(state, <HideAppSpinnerAction> action);
    }
    default: {
      return state;
    }
  }
}

function onShowSideNavAction(state: LayoutState, action: ShowSideNavAction): LayoutState {
  return Object.assign({}, state, {
    sideMenuVisible: true
  });
}

function onHideSideNavAction(state: LayoutState, action: HideSideNavAction): LayoutState {
  return Object.assign({}, state, {
    sideMenuVisible: false
  });
}

function onToggleSideNavAction(state: LayoutState, action: ToggleSideNavAction): LayoutState {
  return Object.assign({}, state, {
    sideMenuVisible: !state.sideMenuVisible
  });
}

function onShowLoading(state: LayoutState, action: ShowLoadingAction): LayoutState {
  return Object.assign({}, state, {
    loading: state.loading + 1
  });
}

function onHideLoading(state: LayoutState, action: HideLoadingAction): LayoutState {
  return Object.assign({}, state, {
    loading: false
  });
}

function onGoUserInfo(state: LayoutState, action: GoUserInfoAction): LayoutState {
  return Object.assign({}, state, {
    swipeTabIndex: 1
  });
}

function onGoMain(state: LayoutState, action: GoUserInfoAction): LayoutState {
  return Object.assign({}, state, {
    swipeTabIndex: 0
  });
}

function onShowAppSpinner(state: LayoutState, action: GoUserInfoAction): LayoutState {
  return Object.assign({}, state, {
    appSpinnerVisible: true
  } as LayoutState);
}

function onHideAppSpinner(state: LayoutState, action: GoUserInfoAction): LayoutState {
  return Object.assign({}, state, {
    appSpinnerVisible: false
  } as LayoutState);
}
