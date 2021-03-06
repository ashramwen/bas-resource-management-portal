import '../styles/styles.scss';

import {
  ApplicationRef,
  NgModule,
  OpaqueToken,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import {
  PreloadAllModules,
  RouterModule,
} from '@angular/router';
import { RouterStoreModule, routerReducer } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  createInputTransfer,
  createNewHosts,
  removeNgStyles,
} from '@angularclass/hmr';

// App is our top level component
import { AppCmp } from './app.component';
import { AppSharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { LocalStorageModule } from 'angular-2-local-storage';
import { LoginModule } from './pages/login/login.module';
import { MatCustomModule } from 'kii-universal-ui';
import { MaterialModule } from './shared/material.module';
import { OverlayContainer } from '@angular/material';
import { PortalModule } from './pages/+portal/portal.module';
import { ROUTES } from './app.routes';
import { StoreLogMonitorModule } from '@ngrx/store-log-monitor';
import { StoreModule } from '@ngrx/store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { instrumentation } from './shared/redux/index';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Application wide providers
const APP_PROVIDERS = [

];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppCmp],
  declarations: [
    AppCmp,
  ],
  imports: [ // import Angular's modules
    // vendor modules
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    // have to comment this line when build:aot:prod
    // instrumentation,
    // StoreLogMonitorModule,
    LocalStorageModule.withConfig({
      prefix: 'bas',
      storageType: 'localStorage'
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    // LocalizeRouterModule.forRoot(ROUTES), // localize router
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),

    // app modules
    PortalModule,
    LoginModule,
    AppSharedModule,
    MatCustomModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
  ) { }

}
