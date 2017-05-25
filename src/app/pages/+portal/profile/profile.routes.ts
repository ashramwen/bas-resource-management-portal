import { CalendarComponent } from './calendar/calendar.component';

export const profileRoutes = [{
  path: 'calendar',
  component: CalendarComponent
}, {
  path: '',
  redirectTo: 'calendar',
  pathMatch: 'prefix',
}];
