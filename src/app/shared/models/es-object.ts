import { ESQueryOption, GroupType } from './es-query-option.interface';

export class Terms {
  public 'state.Power'?: number[];
  public 'state.target'?: string[];
}

export class StateDate {
  public gte: number;
  public lte: number;

  constructor(gte: number, lte: number) {
    this.gte = gte;
    this.lte = lte;
  }
}

export class Range {
  public 'state.date': StateDate;

  constructor(gte: number, lte: number) {
    this['state.date'] = new StateDate(gte, lte);
  }
}

export class Must {
  public terms?: Terms;
  public range?: Range;
}

export class Bool {
  public must: Must[];

  constructor() {
    this.must = [];
  }
}

export class Filter {
  public bool: Bool;

  constructor() {
    this.bool = new Bool();
  }
}

export class Filtered {
  public filter: Filter;

  constructor() {
    this.filter = new Filter();
  }
}

export class Query {
  public filtered: Filtered;

  constructor() {
    this.filtered = new Filtered();
  }
}

export class DateHistogram {
  public field: string;
  public interval: string;
  public 'time_zone': string;

  constructor() {
    this.field = 'state.date';
    this.time_zone = '+08:00';
  }
}

export class ByTime {
  public 'date_histogram': DateHistogram;
  public aggs?: Aggs;

  constructor(interval: string) {
    this.date_histogram = new DateHistogram();
    this.date_histogram.interval = interval;
  }
}

export class AggsTerms {
  public field: string;
  public size?: number;

  constructor(field: string = 'state.target') {
    this.field = field;
  }
}

export class ByTarget {
  public terms: AggsTerms;
  public aggs?: Aggs;

  constructor() {
    this.terms = new AggsTerms();
  }
}

export class Aggs {
  public byHour?: ByTime;
  public byDay?: ByTime;
  public byTarget?: ByTarget;

  public subAggs?: SubAggs;
}

export class SubAggs {
  public sum?: AggsTerms;

  constructor(target: string) {
    this.sum = new AggsTerms(target);
  }
}

export class AvgBucket {
  public 'buckets_path': string;

  constructor(path: string = '') {
    this.buckets_path = `${path}>subAggs`;
  }
}

export class Pipeline {
  public 'avg_bucket'?: AvgBucket;

  constructor(path: string = '') {
    this.avg_bucket = new AvgBucket(path);
  }
}

/**
 * ES Query Object
 *
 * @export
 * @class ESObject
 */
export class ESObject {
  public aggs: Aggs;
  public query: Query;
  public size: number;
  private length?: number;

  constructor(esQueryOption?: ESQueryOption) {
    this.aggs = new Aggs();
    this.query = new Query();
    this.size = 0;

    if (esQueryOption) {
      this.setOption(esQueryOption);
    }
  }

  /**
   * set query option
   *
   * @param {ESQueryOption} esQueryOption
   *
   * @memberOf ESObject
   */
  private setOption(esQueryOption: ESQueryOption) {
    this.setTarget(esQueryOption.target);
    this.setPower(esQueryOption.power);
    this.setTimeRange(esQueryOption.startTime, esQueryOption.endTime);
    this.setGroup(esQueryOption.group, esQueryOption.allTargets);
    this.setPipeline(esQueryOption.pipeline);
    delete this.length;
  }

  /**
   * set power query option
   *
   * @param {boolean} power
   *
   * @memberOf ESObject
   */
  private setPower(power: boolean | number) {
    let must = new Must();
    must.terms = new Terms();
    must.terms['state.Power'] = [power ? 1 : 0];
    this.query.filtered.filter.bool.must.push(must);
  }

  /**
   * set query targets
   *
   * @param {string[]} targets(kiiThingID)
   *
   * @memberOf ESObject
   */
  private setTarget(targets: string[]) {
    let must = new Must();
    must.terms = new Terms();
    must.terms['state.target'] = targets;
    this.query.filtered.filter.bool.must.push(must);
    this.length = targets.length;
  }

  /**
   * set query time range and interval
   *
   * @param {number} startTime
   * @param {number} endTime
   * @param {string} interval
   *
   * @memberOf ESObject
   */
  private setTimeRange(startTime: number, endTime: number) {
    let must = new Must();
    must.range = new Range(startTime, endTime);
    this.query.filtered.filter.bool.must.push(must);
  }

  /**
   * let the query is grouped by target
   *
   *
   * @memberOf ESObject
   */
  private setGroupByTarget(all: boolean) {
    this.aggs.byTarget = new ByTarget();
    if (all) {
      this.aggs.byTarget.terms.size = this.length;
    }
  }

  /**
   * set group by
   *
   * @param {GroupType} group
   *
   * @memberOf ESObject
   */
  private setGroup(group: GroupType, all: boolean) {
    if (group & GroupType.Target) {
      this.setGroupByTarget(all);
    }
    if (group & GroupType.Hour) {
      this.aggs.byHour = new ByTime('1h');
    }
    if (group & GroupType.Day) {
      this.aggs.byDay = new ByTime('1d');
    }
  }

  /**
   * set pipeline aggregations
   *
   * @param {GroupType} pipeline
   *
   * @memberOf ESObject
   */
  private setPipeline(pipeline: GroupType) {
    let i = 0;
    if (pipeline & GroupType.Hour) {
      this.aggs[i++] = new Pipeline('byHour');
      this.aggs.byHour.aggs = new Aggs();
      this.aggs.byHour.aggs.subAggs = new SubAggs('state.Power');
    }
    if (pipeline & GroupType.Day) {
      this.aggs[i++] = new Pipeline('byDay');
      this.aggs.byDay.aggs = new Aggs();
      this.aggs.byDay.aggs.subAggs = new SubAggs('state.Power');
    }
    if (pipeline & GroupType.Target) {
      this.aggs[i++] = new Pipeline('byTarget');
      this.aggs.byTarget.aggs = new Aggs();
      this.aggs.byTarget.aggs.subAggs = new SubAggs('state.Power');
    }
  }
}
