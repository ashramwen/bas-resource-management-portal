import { EFFECTS, instrumentation, reducer } from './redux/index';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

import { BrowserModule } from '@angular/platform-browser';
import { DBModule } from '@ngrx/db';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterStoreModule } from '@ngrx/router-store';
import { SHARED_MODULES } from './components/index';
import { SHARED_PROVIDERS } from './providers/index';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TokenEffects } from './redux/token/effects';
import { schema } from '../configs/db';
import { MatCustomModule } from 'kii-universal-ui';
import { BasORMModule } from './orm/orm.module';
import { SHARED_PIPES } from './pipes/index';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [
    FormsModule,
    ...EFFECTS,
    DBModule.provideDB(schema),
    StoreModule.provideStore(reducer),
    HttpModule,
    RouterStoreModule.connectRouter(),
    MatCustomModule,
    SHARED_MODULES,
    BasORMModule,
    PipesModule
  ],
  exports: [SHARED_MODULES, PipesModule],
  declarations: [],
  providers: [...SHARED_PROVIDERS],
})
export class AppSharedModule { }
