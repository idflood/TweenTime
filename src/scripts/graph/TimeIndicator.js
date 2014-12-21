let $ = require('jquery');
let d3 = require('d3');

export default class TimeIndicator {
  constructor(timeline, container) {
    this.timeline = timeline;
    this.container = container;
    this.timeSelection = this.container.selectAll('.time-indicator').data(this.timeline.currentTime)
    var timeGrp = this.timeSelection.enter().append("svg")
      .attr('class', "time-indicator timeline__right-mask")
      .attr('width', window.innerWidth - this.timeline.label_position_x)
      .attr('height', 442);

    this.timeSelection = timeGrp.append('rect')
      .attr('class', 'time-indicator__line')
      .attr('x', -1)
      .attr('y', -this.timeline.margin.top - 5)
      .attr('width', 1)
      .attr('height', 1000);
  }

  render() {
    this.timeSelection = this.container.selectAll('.time-indicator rect');
    this.timeSelection.attr('x', this.timeline.x(this.timeline.currentTime[0]) - 0.5);
  }
}
