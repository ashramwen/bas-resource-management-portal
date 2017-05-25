import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import {
  addDays,
  addHours,
  endOfDay,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
} from 'date-fns';

import { MdMenuTrigger } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'bas-calendar',
  templateUrl: './bas-calendar.component.html',
  styleUrls: ['./bas-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasCalendarComponent {

  @ViewChild('trial')
  public mdMenu: MdMenuTrigger;

  @ViewChild('modalContent')
  public modalContent: TemplateRef<any>;

  public view: string = 'month';
  public viewDate: Date = new Date();

  private modalData: {
    action: string,
    event: CalendarEvent
  };

  private actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];

  private refresh: Subject<any> = new Subject();

  private events: CalendarEvent[] = [{
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions,
    draggable: true
  }, {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months',
    color: colors.blue,
    draggable: true
  }, {
    start: addHours(startOfDay(new Date()), 2),
    end: new Date(),
    title: 'A draggable and resizable event',
    color: colors.yellow,
    actions: this.actions,
    resizable: {
      beforeStart: true,
      afterEnd: true
    },
    draggable: true
  }];

  private activeDayIsOpen: boolean = false;

  constructor() {
    //
  }

  public dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    // this.modalData = {event, action};
    // this.modal.open(this.modalContent, {size: 'lg'});
  }

  public addEvent(date: Date): void {
    this.events.push({
      start: date,
      title: 'New event',
      color: colors.red
    });
    this.refresh.next();
  }
}
