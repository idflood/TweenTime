let d3 = require('d3');
let Signals = require('js-signals');
import Utils from '../core/Utils';

export default class Properties {
  constructor(timeline) {
    this.timeline = timeline;
    this.onKeyAdded = new Signals.Signal();
    this.subGrp = false;
  }

  propertyVal(d) {
    if (d.properties) {
      if (this.timeline.editor.options.showEmptyProperties) {
        return d.properties;
      }
      else {
        return d.properties.filter((prop) => {return prop.keys.length;});
      }
    }
    return [];
  }

  propertyKey(d) {
    return d.name;
  }

  setSublineHeight(d, i) {
    const sub_height = (i + 1) * this.timeline.lineHeight;
    return 'translate(0,' + sub_height + ')';
  }

  render(bar) {
    var self = this;
    var editor = this.timeline.editor;
    var core = editor.tweenTime;

    var properties = bar.selectAll('.line-item').data((d) => this.propertyVal(d), this.propertyKey);
    var subGrp = properties.enter()
      .append('g')
      .attr('class', 'line-item');

    // Save subGrp in a variable for use in Errors.coffee
    self.subGrp = subGrp;


    properties.attr('transform', (d, i) => this.setSublineHeight(d, i));

    subGrp.append('rect')
      .attr('class', 'click-handler click-handler--property')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', self.timeline.x(self.timeline.timer.totalDuration + 100))
      .attr('height', self.timeline.lineHeight)
      .on('dblclick', function(d) {
        const lineValue = d._line;
        let def = d.default ? d.default : 0;
        const mouse = d3.mouse(this);
        let dx = self.timeline.x.invert(mouse[0]);
        dx = dx.getTime() / 1000;
        const prevKey = Utils.getPreviousKey(d.keys, dx);
        // set the value to match the previous key if we found one
        if (prevKey) {
          def = prevKey.val;
        }
        //d._line = lineValue;
        const newKey = {
          time: dx,
          val: def,
          _property: d
        };
        if (core.options.defaultEase) {
          newKey.ease = core.options.defaultEase;
        }

        d.keys.push(newKey);
        // Sort the keys for tweens creation
        d.keys = Utils.sortKeys(d.keys);
        lineValue._isDirty = true;

        lineValue._isDirty = true;
        self.onKeyAdded.dispatch(newKey);
      });

    // Mask
    subGrp.append('svg')
      .attr('class', 'line-item__keys timeline__right-mask')
      .attr('width', window.innerWidth - self.timeline.label_position_x)
      .attr('height', self.timeline.lineHeight);

    this.renderPropertiesLabel(bar, properties);

    subGrp.append('line')
      .attr('class', 'line-separator--secondary')
      .attr('x1', -self.timeline.margin.left)
      .attr('y1', self.timeline.lineHeight)
      .attr('y2', self.timeline.lineHeight);

    // Hide property line separator if curve editor is enabled.
    bar.selectAll('.line-separator--secondary')
      .attr('x2', function() {
        if (editor.curveEditEnabled) {
          return 0;
        }
        return self.timeline.x(self.timeline.timer.totalDuration + 100);
      });

    bar.selectAll('.line-item').attr('display', function(property) {
      if (!property._line.collapsed) {
        return 'block';
      }
      return 'none';
    });

    // Hide click handler if curve editor mode.
    bar.selectAll('.click-handler').attr('display', function() {
      if (!editor.curveEditEnabled) {
        return 'block';
      }
      return 'none';
    });

    properties.exit().remove();

    return properties;
  }

  renderPropertiesLabel(bar, subGrp) {
    subGrp.append('text')
      .attr({
        class: 'line-label line-label--sub line-label--small',
        x: this.timeline.label_position_x + 10,
        y: 15
      })
      .text((d) => d.name)
      .on('click', (d) => {
        this.timeline.selectionManager.select(d);
      });
  }
}
