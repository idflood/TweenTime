export default class TimeIndicator {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
    this.timeSelection = this.container.selectAll('.time-indicator').data(this.timeline.currentTime);
    this.timeGrp = this.timeSelection.enter().append('svg')
      .attr('class', 'time-indicator timeline__right-mask')
      .attr('width', window.innerWidth - this.timeline.label_position_x)
      .attr('height', 442);

    this.timeSelection = this.timeGrp.append('rect')
      .attr('class', 'time-indicator__line')
      .attr('x', 0)
      .attr('y', -this.timeline.margin.top - 5)
      .attr('width', 1)
      .attr('height', 1000);

    this.timeSelection = this.container.selectAll('.time-indicator rect');
  }

  updateHeight(height) {
    this.timeGrp.attr('height', height);
    this.timeSelection.attr('height', height + this.timeline.margin.top + 5);
  }

  render() {
    this.timeSelection.attr('transform', 'translate(' + (this.timeline.x(this.timeline.currentTime[0]) - 0.5) + ',0)');
  }
}
