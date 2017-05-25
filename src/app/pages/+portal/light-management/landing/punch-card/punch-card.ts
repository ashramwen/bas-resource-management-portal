import * as d3 from 'd3';

export class PunchCard {
  private chart;
  private color = '#7d8ead';
  private data;
  private height = 520;
  private innerHeight;
  private innerWidth;
  private margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 100
  };
  private r;
  private target;
  private unitHeight;
  private unitSize;
  private unitWidth;
  private width = 1440;
  private x;
  private xAxis;
  private xticks = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
  private y;
  private yAxis;
  private yticks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private tip;

  constructor(options) {
    Object.assign(this, options);
    this._init();
  }

  public render(data) {
    data = (data || []).filter((d) => {
      return Array.isArray(d) &&
        d.length === 3 &&
        d[0] >= 0 &&
        d[0] <= 6 &&
        d[1] >= 0 &&
        d[1] <= 23;
    });

    this.data = data;
    this._renderCard();
  };

  public clear() {
    this.chart.selectAll('*').remove();
  };

  private _init() {
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.unitWidth = this.innerWidth / 24;
    this.unitHeight = this.innerHeight / 7;

    this.unitSize = Math.min(this.unitWidth, this.unitHeight);

    this.chart = d3.select(this.target)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');

    this.tip = d3.select(this.target).select('div.d3-tip');

    this.x = d3.scaleLinear().domain([0, 23])
      .range([this.unitWidth / 2, this.innerWidth - this.unitWidth / 2]);

    this.y = d3.scaleLinear().domain([0, 6])
      .range([this.unitHeight / 2, this.innerHeight - this.unitHeight / 2]);

    this.xAxis = d3.axisBottom(this.x).ticks(24)
      .tickFormat((d, i) => this.xticks[i]);

    this.yAxis = d3.axisLeft(this.y).ticks(7).tickFormat((d, i) => this.yticks[i]);

    this._renderAxis();
  }

  private _renderCard() {
    let data = this.data;
    let maxVal = d3.max(data, (d) => d[2]);
    let tip = this.tip;

    this.r = d3.scaleSqrt().domain([0, parseInt(maxVal, 0)]).range([0, this.unitSize / 4]);

    let circles = this.chart.selectAll('circle').data(data);

    let updates = [circles, circles.enter().append('circle')];
    updates.forEach((group) => {
      group
        .attr('cx', (d) => this.x(d[1]))
        .attr('cy', (d) => this.y(d[0]))
        .attr('r', (d) => this.r(d[2]))
        .style('fill', this.color)
        .on('mouseover', function (d) {
          let ele = d3.select(this);
          let x = parseFloat(ele.attr('cx')) + 65;
          let y = parseFloat(ele.attr('cy')) - (parseFloat(ele.attr('r')) * 2);
          tip.transition()
            .duration(200)
            .style('opacity', .9);
          tip.html(d[2])
            .style('left', x + 'px')
            .style('top', y + 'px');
        })
        .on('mouseout', (d) => {
          tip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    });

    circles.exit().remove();
  }
  private _renderAxis() {
    this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(this.xAxis);

    this.chart.append('g').attr('class', 'y axis').call(this.yAxis);
  }
}
