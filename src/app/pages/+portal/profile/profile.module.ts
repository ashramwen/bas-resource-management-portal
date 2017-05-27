import { BasCalendarComponent } from './../components/bas-calendar/bas-calendar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCustomModule } from 'kii-universal-ui';

@NgModule({
  imports: [
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    CalendarModule.forRoot(),
    MatCustomModule
  ],
  declarations: [
    CalendarComponent,
    BasCalendarComponent
  ]
})
export class ProfileModule { }
