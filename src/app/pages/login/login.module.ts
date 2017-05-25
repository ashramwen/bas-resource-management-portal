import { NgModule } from '@angular/core';
import { LoginCmp } from './login.component';
import { LoginBgComponent } from './components/login-bg.component';
import { AppSharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCustomModule } from 'kii-universal-ui';
import { RouterModule } from '@angular/router';
import { LoginBgImgComponent } from './components/login-bg-img.component';

@NgModule({
  declarations: [
    LoginCmp,
    LoginBgComponent,
    LoginBgImgComponent
  ],
  imports: [
    AppSharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    MatCustomModule,
    RouterModule,
  ],
  exports: [LoginCmp],
})
export class LoginModule { }
