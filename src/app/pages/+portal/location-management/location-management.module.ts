import { NgModule } from '@angular/core';
import { LocationManagementCmp } from './location-management.component';
import { BRLocationListViewCmp } from './list-view/list-view.component';
import { BRLocationMapViewCmp } from './map-view/map-view.component';
import { MatCustomModule } from 'kii-universal-ui';
import { SHARED_MODULES } from '../../../shared/components/index';
import { BRLocationListItemCmp } from './list-view/list-item.component';
import { BRLocationEditorCmp } from './list-view/location-editor.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from '../../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JSONEditorModule } from 'ng2-jsoneditor';

@NgModule({
  declarations: [
    LocationManagementCmp,
    BRLocationListViewCmp,
    BRLocationMapViewCmp,
    BRLocationListItemCmp,
    BRLocationEditorCmp,
  ],
  entryComponents: [BRLocationListItemCmp],
  imports: [
    MatCustomModule,
    SHARED_MODULES,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    FlexLayoutModule,
    JSONEditorModule,
  ]
})
export class LocationManagementModule { }
