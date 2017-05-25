import { Location } from '../../models/location.interface';
import {
  Actions,
  ActionTypes,
  LoadAction,
  LoadSuccessAction,
  LoadFailureAction,
  LoginFailureAction,
  LoginSuccessAction,
  ClearAction
} from './actions';
import { Action } from '@ngrx/store';
import { Token } from '../../models/token.interface';

export interface TokenState {
  token: Token;
  loggedIn: boolean;
  loginFailed: boolean;
  errorCode: number;
  statusCode: number;
  errorMessage: string;
};

export const initialState: TokenState = {
  token: null,
  loggedIn: false,
  loginFailed: false,
  errorCode: null,
  statusCode: null,
  errorMessage: null
};

export function tokenReducer(state = initialState, action: Actions): TokenState {
  switch (action.type) {
    case ActionTypes.LOAD_SUCCESS: {
      return onLoadSuccess(state, <LoadSuccessAction> action);
    }
    case ActionTypes.LOAD_FAILED: {
      return onLoadFailed(state, <LoadFailureAction> action);
    }
    case ActionTypes.LOGIN_SUCCESS: {
      return onLoginSucceeded(state, <LoginSuccessAction> action);
    }
    case ActionTypes.LOGIN_FAILED: {
      return onLoginFailed(state, <LoginFailureAction> action);
    }
    case ActionTypes.CLEAR: {
      return onClear(state, <ClearAction> action);
    }
    default: {
      return state;
    }
  }
}

function onLoadSuccess(state: TokenState, action: LoadSuccessAction): TokenState {
  return {
    token: action.payload,
    loggedIn: true,
    loginFailed: false,
    errorCode: null,
    errorMessage: null,
    statusCode: null
  };
}

function onLoadFailed(state: TokenState, action: LoadFailureAction): TokenState {
  return {
    token: null,
    loggedIn: false,
    loginFailed: false,
    errorCode: null,
    errorMessage: null,
    statusCode: null
  };
}

function onLoginSucceeded(state: TokenState, action: LoginSuccessAction): TokenState {
  return {
    token: action.payload,
    loggedIn: true,
    loginFailed: false,
    errorCode: null,
    errorMessage: null,
    statusCode: null
  };
}

function onLoginFailed(state: TokenState, action: LoginFailureAction): TokenState {
  return Object.assign({
    token: null,
    loggedIn: false,
    loginFailed: false,
    errorCode: null,
    errorMessage: null,
    statusCode: null
  }, action.payload);
}

function onClear(state: TokenState, action: ClearAction): TokenState {
  return {
    token: null,
    loggedIn: false,
    loginFailed: false,
    errorCode: null,
    errorMessage: null,
    statusCode: null
  };
}
