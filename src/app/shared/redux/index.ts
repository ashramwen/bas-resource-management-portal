import { EffectsModule } from '@ngrx/effects';
import { ActionReducer } from '@ngrx/store';
import { compose } from '@ngrx/core';
import { ModuleWithProviders } from '@angular/core';
import { routerReducer } from '@ngrx/router-store';
import { RouterStateSnapshot } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

import { LayoutState, layoutReducer } from './layout';
import { TokenState, TokenEffects, tokenReducer } from './token';
import { globalReducer, GlobalState } from './global/reducer';

const reducers = {
  token: tokenReducer,
  router: routerReducer,
  layout: layoutReducer,
  global: globalReducer
};

export const EFFECTS = [
  EffectsModule.run(TokenEffects)
];

export interface RootState {
  token: TokenState;
  layout: LayoutState;
  router: RouterStateSnapshot;
  global: GlobalState;
}

const developmentReducer: ActionReducer<RootState>
  = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<RootState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (ENV === 'production') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

@NgModule()
export class DummyModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonModule
    };
  }
}

export const instrumentation: ModuleWithProviders =
  (ENV !== 'production') ? StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 15,
      monitor: useLogMonitor({ visible: false, position: 'right' })
    })
    : DummyModule.forRoot();
