/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { HideLoadingAction, ShowLoadingAction } from './shared/redux/layout/actions';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';

import { AppState } from './app.service';
import { LayoutState } from './shared/redux/layout/reducer';
import { Observable } from 'rxjs';
import { RootState } from './shared/redux/index';
import { StateSelectors } from './shared/redux/selectors';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { createSelector } from 'reselect';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  templateUrl: './app.component.html'
})
export class AppCmp implements OnInit {

  public showAppLoader$: Observable<boolean>;

  constructor(
    private router: Router,
    private store: Store<RootState>,
    translate: TranslateService,
  ) {
    // this language will be used as a fallback
    // when a translation isn't found in the current language
    translate.setDefaultLang('en');
    this.showAppLoader$ = this.store.select(
      createSelector(
        StateSelectors.layout,
        (state: LayoutState) => state.appSpinnerVisible
      )
    );

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use('en');
  }

  public ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.store.dispatch(new ShowLoadingAction());
    }
    if (event instanceof NavigationEnd) {
      this.store.dispatch(new HideLoadingAction());
    }

    if (event instanceof NavigationCancel) {
      this.store.dispatch(new HideLoadingAction());
    }
    if (event instanceof NavigationError) {
      this.store.dispatch(new HideLoadingAction());
    }
  }

}
