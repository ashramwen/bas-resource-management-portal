import { Bucket, ESResponse } from '../../../../shared/models/es-response.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ESQueryOption, GroupType } from '../../../../shared/models/es-query-option.interface';
import { Observable, Subject } from 'rxjs';
import { endOfDay, setDay, startOfDay, subDays } from 'date-fns';

import { ActivatedRoute } from '@angular/router';
import { Message } from 'stompjs';
import { StompService } from '../../../../shared/providers/stomp.service';
import { StompThing } from '../../../../shared/models/stomp-thing.interface';
import { Thing } from '../../../../shared/models/thing.interface';
import { EsQueryService } from '../../../../shared/providers/resource-services/es-query.service';

/**
 * five minutes
 */
const FIVE_MINUTES = 300000;

@Component({
  selector: 'bas-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingCmp implements OnInit {

  /**
   * number of Power On lights
   *
   * @type {number}
   * @memberOf LandingCmp
   */
  public numberOfPowerOn: number;

  /**
   * number of connected lights
   *
   * @type {number}
   * @memberOf LandingCmp
   */
  public numberOfConnected: number;

  /**
   * array of thingID
   *
   * @type {string[]}
   * @memberOf LandingCmp
   */
  public thingIDs: string[];
  /**
   * punch data
   *
   * @type {number[]}
   * @memberOf LandingCmp
   */
  public punchData: number[];
  /**
   * top 10 of light usage
   *
   * @type {Bucket[]}
   * @memberOf LandingCmp
   */
  public top10: Bucket[];
  /**
   * the times of on of all lights yesterday
   *
   * @type {number}
   * @memberOf LandingCmp
   */
  public numberOfYesterday: number;
  /**
   * average time of ON of all lights the days before yesterday
   *
   * @type {number}
   * @memberOf LandingCmp
   */
  public avgOfHistory: number;
  private lights: Thing[];

  constructor(
    private route: ActivatedRoute,
    private esQuery: EsQueryService,
    private stomp: StompService
  ) {
    this.numberOfPowerOn = 0;
    this.numberOfConnected = 0;
  }

  public ngOnInit() {
    this.lights = this.route.snapshot.data['lightings'];
    this.parseData();

    this.getPunchCard();
    this.getTopN();
    this.getYesterday();
    this.getHistory();
  }

  private getPunchCard() {
    let punchCard$ = this.esQuery.query({
      startTime: startOfDay(setDay(new Date(), -7)).valueOf(),
      endTime: endOfDay(setDay(new Date(), -1)).valueOf(),
      power: true,
      target: this.thingIDs,
      allTargets: true,
      group: GroupType.Hour
    });

    punchCard$.subscribe((r: ESResponse) => {
      this.punchData = r.aggregations.byHour.buckets.map((o) => o.doc_count);
    });
  }

  private getYesterday() {
    let yesterday$ = this.esQuery.query({
      startTime: startOfDay(subDays(new Date(), 1)).valueOf(),
      endTime: endOfDay(subDays(new Date(), 1)).valueOf(),
      power: true,
      target: this.thingIDs,
      allTargets: true,
      group: GroupType.Target,
      pipeline: GroupType.Target
    });

    yesterday$.subscribe((r: ESResponse) => {
      this.numberOfYesterday = r.aggregations[0].value * 5;
    });
  }

  private getHistory() {
    let history$ = this.esQuery.query({
      startTime: 0,
      endTime: endOfDay(subDays(new Date(), 2)).valueOf(),
      power: true,
      target: this.thingIDs,
      group: GroupType.Day,
      pipeline: GroupType.Day
    });

    history$.subscribe((r: ESResponse) => {
      this.avgOfHistory = r.aggregations[0].value * 5 / this.lights.length;
    });
  }

  private getTopN() {
    let top$ = this.esQuery.query({
      startTime: 0,
      endTime: new Date().valueOf(),
      power: true,
      target: this.thingIDs,
      group: GroupType.Target
    });

    top$.subscribe((r: ESResponse) => {
      this.parseThings(r.aggregations.byTarget.buckets);
    });
  }

  /**
   * parse lights data
   * get the number of power on
   * get the number of connected
   *
   * @private
   *
   * @memberOf LandingCmp
   */
  private parseData() {
    this.thingIDs = [];
    let now = new Date().valueOf();
    this.lights.forEach((thing: Thing) => {
      this.thingIDs.push(thing.kiiThingID);
      this.countNumberOfPowerOn(thing);
      this.countNumberOfConnected(thing, now);
    });
  }

  private countNumberOfPowerOn(thing: Thing) {
    if (!thing.status || !thing.status.Power) { return; }
    this.numberOfPowerOn++;
  }

  private countNumberOfConnected(thing: Thing, timeStamp: number) {
    if (!thing.status || !thing.status.date) { return; }
    if (thing.status.date + FIVE_MINUTES < timeStamp) { return; }
    this.numberOfConnected++;
  }

  private parseThings(buckets: Bucket[]) {
    this.top10 = buckets.map((bucket: Bucket) => {
      bucket.vendorThingID = this.findThing(bucket.key).vendorThingID;
      return bucket;
    });
  }

  private findThing(thingID: string): Thing {
    return this.lights.find((thing: Thing) => thing.kiiThingID === thingID);
  }

  private stompTest() {
    this.stomp
      .on('/topic/493e83c9/th.f83120e36100-02d8-6e11-cb0a-0fa10ec4')
      .subscribe((message: StompThing) => {
        console.log(message);
      });

    this.stomp
      .on('/topic/493e83c9/th.f83120e36100-02d8-6e11-db0a-063004d9')
      .subscribe((message: StompThing) => {
        console.log(message);
      });
  }
}
