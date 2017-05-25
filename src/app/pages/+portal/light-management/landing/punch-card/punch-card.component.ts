import * as d3 from 'd3';

import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { PunchCard } from './punch-card';

@Component({
  selector: 'punch-card',
  templateUrl: './punch-card.component.html',
  styleUrls: ['./punch-card.component.scss']
})
export class PunchCardComponent implements OnInit, OnChanges {

  @Input()
  public data: number[];

  @ViewChild('chart')
  public chartContainer: ElementRef;

  private punchChart: HTMLDivElement;
  private chart: PunchCard;

  constructor() {
    //
  }

  public ngOnInit() {
    this.punchChart = this.chartContainer.nativeElement;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!this.data) { return; }

    if (!this.chart) {
      this.chart = new PunchCard({
        target: `#${this.punchChart.id}`,
        width: this.punchChart.clientWidth,
        height: 533
      });
    }

    let x = 0;
    let y = 0;
    let data = [];
    this.data.forEach((val) => {
      data.push([x, y++, val]);
      if (y === 24) {
        y = 0;
        x++;
      }
    });
    this.chart.render(data);
  }

}
