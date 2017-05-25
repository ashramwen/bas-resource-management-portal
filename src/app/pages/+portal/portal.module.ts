import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppSharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LAYOUT_CMP } from './components/index';
import { LightManagementModule } from './light-management/light-management.module';
import { MatCustomModule } from 'kii-universal-ui';
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { PasswordChangeCmp } from './user-info.ts/password-change/password-change.component';
import { PortalCmp } from './portal.component';
import { ProfileModule } from './profile/profile.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfoCmp } from './user-info.ts/user-info.component';

@NgModule({
  declarations: [
    PortalCmp,
    UserInfoCmp,
    PasswordChangeCmp,
    LAYOUT_CMP,
  ],
  imports: [
    AppSharedModule,
    TranslateModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    ReactiveFormsModule,
    MatCustomModule,
    RouterModule,
    LightManagementModule,
    ProfileModule
  ],
  entryComponents: [PasswordChangeCmp],
  exports: [PortalCmp],
})
export class PortalModule {

}
