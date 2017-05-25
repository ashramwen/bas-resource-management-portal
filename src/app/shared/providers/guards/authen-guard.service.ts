import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild,
  ActivatedRouteSnapshot, RouterStateSnapshot, Router, NavigationExtras
} from '@angular/router';
import { AuthService } from '../providers/auth.service';
import { Store } from '@ngrx/store';
import { RootState } from '../../redux/index';
import { TokenState } from '../../redux/token/reducer';
import { go } from '@ngrx/router-store';
import { StateSelectors } from '../../redux/selectors';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private store: Store<RootState>
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkLogin(route, state);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  private checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isLoggedIn = false;
    this.store.select(StateSelectors.token)
      .subscribe((token: TokenState) => {
        isLoggedIn = token.loggedIn;
      });
    if (isLoggedIn) { return true; };

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: Object.assign({}, route.queryParams, { redirectUrl: state.url })
    };

    this.store.dispatch(go(['/login'], navigationExtras.queryParams, navigationExtras));
    return false;
  }
}
