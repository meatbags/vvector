import { Point } from './Point.js';
import { Colour } from '../styles/Colour.js';
import { Animation } from '../core/Animation.js';
import { CopyParams } from '../utils/Params.js';

function Line(params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // set defaults
    this.defaults = {
      label: params.label || 'default',
      x1: params.x1 || 0,
      y1: params.y1 || 0,
      x2: params.x2 || 0,
      y2: params.y2 || 0,
      stroke: params.stroke || true,
      strokeStyle: params.strokeStyle || 0x0,
      lineWidth: params.lineWidth || 1,
      percentageCoords: params.percentageCoords || false,
      time: params.time || 1.0,
      easing: params.easing || 'ease-linear',
      automation: params.automation || false
    };

    // coordinates
    this.p1 = new Point(this.defaults.x1, this.defaults.y1);
    this.p2 = new Point(this.defaults.x2, this.defaults.y2);

    // settings
    this.percentage = params.percentageCoords || false;

    // style
    this.stroke = this.defaults.stroke;
    this.lineWidth = new Point(this.defaults.lineWidth, 0);
    this.strokeStyle = new Colour(this.defaults.strokeStyle);

    // animation
    Animation.call(
      this,
      this.defaults.time,
      this.defaults.easing,
      this.defaults.automation,
      {
        label: this.defaults.label,
        p1: new Point(this.defaults.x1, this.defaults.y1),
        p2: new Point(this.defaults.x2, this.defaults.y2),
        lineWidth: new Point(this.defaults.lineWidth, 0),
        strokeStyle: new Colour(this.defaults.strokeStyle)
      }
    );
}

Line.prototype = Object.create(Animation.prototype);
Line.prototype.constructor = Line;

Line.prototype.draw = function(ctx) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.p2.update(this.time);
    this.lineWidth.update(this.time);
    this.strokeStyle.update(this.time);

    ctx.strokeStyle = this.strokeStyle.colour;
    ctx.lineWidth = this.lineWidth.x;
    ctx.lineCap = 'round';

    ctx.beginPath();
    if (!this.percentage) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
    } else {
        ctx.moveTo(this.p1.x * ctx.canvas.width, this.p1.y * ctx.canvas.height);
        ctx.lineTo(this.p2.x * ctx.canvas.width, this.p2.y * ctx.canvas.height);
    }
    ctx.stroke();
};

Line.prototype.addState = function(params) {
  var newParams = CopyParams(this.defaults, params);
  var newState = {
    label: newParams.label,
    p1: new Point(newParams.x1, newParams.y1),
    p2: new Point(newParams.x2, newParams.y2),
    lineWidth: new Point(newParams.lineWidth, 0),
    strokeStyle: new Colour(newParams.strokeStyle)
  };

  // add state
  this.pushState(newState);
};

export { Line };
