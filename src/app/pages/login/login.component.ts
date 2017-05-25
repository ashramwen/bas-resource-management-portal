import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { go, replace, search, show, back, forward } from '@ngrx/router-store';
import { Response } from '@angular/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { SessionService } from '../../shared/providers/session.service';
import { RootState } from '../../shared/redux/index';
import { Token } from '../../shared/models/token.interface';
import { LoginSuccessAction, LoginFailureAction } from '../../shared/redux/token/actions';
import { Credential } from '../../shared/models/credential.interface';
import { HttpError } from '../../shared/models/http-error.interface';
import { TokenState } from '../../shared/redux/token/reducer';
import { StateSelectors } from '../../shared/redux/selectors';
import { ShowLoadingAction, HideLoadingAction } from '../../shared/redux/layout/actions';
import { AlertModal } from 'kii-universal-ui';

@Component({
  selector: 'bas-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginCmp implements OnInit {

  public credentials: Credential = {
    userName: '',
    password: '',
    permanentToken: false
  };

  public loginForm: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  public processing: boolean; // submitting forms

  constructor(
    private loginService: SessionService,
    private store: Store<RootState>,
    private router: ActivatedRoute,
    private alert: AlertModal,
    private formBuilder: FormBuilder
  ) {  }

  public ngOnInit() {
    this.store.select(StateSelectors.token).subscribe((tokenState: TokenState) => {
      if (tokenState && tokenState.loggedIn) {
        this.store.dispatch(go(['portal']));
      }
    }).unsubscribe();
  }

  public async login() {
    this.processing = true;
    Object.assign(this.credentials, this.loginForm.value);
    try {
      let token = await this.loginService
        .login(this.credentials)
        .map((res) => {
          return <Token> res.json();
        }).toPromise();

      this.store.dispatch(new LoginSuccessAction(token));
      this.router.queryParams.subscribe(async (params) => {
        let redirectUrl = params['redirectUrl'];
        let newParams = Object.assign({}, params);
        delete newParams['redirectUrl'];

        if (redirectUrl) {
          this.store.dispatch(go([redirectUrl], newParams));
        } else {
          this.store.dispatch(go(['portal/landing']));
        }
      });
    } catch (err) {
      let msg: HttpError = <any> err.json();
      this.alert.failure('Login.userNamePasswordNotMatch');
      this.store.dispatch(new LoginFailureAction({
        statusCode: err.status,
        errorCode: msg.errorCode,
        errorMessage: msg.errorMessage
      }));
    } finally {
      this.processing = false;
    }
  }
}
