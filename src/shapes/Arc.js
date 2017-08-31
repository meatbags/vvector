import { Point } from './Point.js';
import { Colour } from '../styles/Colour.js';
import { Animation } from '../core/Animation.js';
import { CopyParams } from '../utils/Params.js';

function Arc(params) {
  if (typeof(params) === 'undefined') {
    var params = {};
  }

  // set defaults
  this.defaults = {
    label: params.label || 'default',
    x: params.x || 0,
    y: params.y || 0,
    radius: params.radius || 1,
    startAngle: params.startAngle || 0,
    stopAngle: params.stopAngle || Math.PI * 2,
    stroke: params.stroke || true,
    fill: (params.fillStyle || params.fill == true) ? true : false,
    strokeStyle: params.strokeStyle || 0x0,
    fillStyle: params.fillStyle || 0xffffff,
    lineWidth: params.lineWidth || 1,
    percentageCoords: params.percentageCoords || false,
    time: params.time || 1.0,
    easing: params.easing || 'ease-linear',
    automation: params.automation || false
  };

  // coordinates
  this.p1 = new Point(this.defaults.x, this.defaults.y);
  this.radius = new Point(this.defaults.radius, 0);
  this.angle = new Point(this.defaults.startAngle, this.defaults.stopAngle);

  // settings
  this.percentage = this.defaults.percentageCoords;

  // style
  this.stroke = this.defaults.stroke;
  this.fill = this.defaults.fill;
  this.lineWidth = new Point(this.defaults.lineWidth, 0);
  this.strokeStyle = new Colour(this.defaults.strokeStyle);
  this.fillStyle = new Colour(this.defaults.fillStyle);

  // animation
  Animation.call(
    this,
    this.defaults.time,
    this.defaults.easing,
    this.defaults.automation,
    {
      label: this.defaults.label,
      p1: new Point(this.defaults.x, this.defaults.y),
      radius: new Point(this.defaults.radius, 0),
      angle: new Point(this.defaults.startAngle, this.defaults.stopAngle),
      lineWidth: new Point(this.defaults.lineWidth, 0),
      strokeStyle: new Colour(this.defaults.strokeStyle),
      fillStyle: new Colour(this.defaults.fillStyle)
    }
  );
}

Arc.prototype = Object.create(Animation.prototype);
Arc.prototype.constructor = Arc;

Arc.prototype.draw = function(ctx) {
  this.updateAnimation();
  this.p1.update(this.time);
  this.radius.update(this.time);
  this.angle.update(this.time);
  this.lineWidth.update(this.time);
  this.strokeStyle.update(this.time);
  this.fillStyle.update(this.time);

  ctx.beginPath();
  if (!this.percentage) {
    ctx.arc(this.p1.x, this.p1.y, this.radius.x, this.angle.x, this.angle.y, false);
  } else {
    ctx.arc(this.p1.x * ctx.canvas.width, this.p1.y * ctx.canvas.height, this.radius.x * ctx.canvas.width, this.angle.x, this.angle.y, false);
  }

  if (this.fill) {
    ctx.fillStyle = this.fillStyle.colour;
    ctx.fill();
  }
  if (this.stroke) {
    ctx.strokeStyle = this.strokeStyle.colour;
    ctx.lineWidth = this.lineWidth.x;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
};

Arc.prototype.addState = function(params) {
  var newParams = CopyParams(this.defaults, params);
  var newState = {
    label: newParams.label,
    p1: new Point(newParams.x, newParams.y),
    radius: new Point(newParams.radius, 0),
    angle: new Point(newParams.startAngle, newParams.stopAngle),
    lineWidth: new Point(newParams.lineWidth, 0),
    strokeStyle: new Colour(newParams.strokeStyle),
    fillStyle: new Colour(newParams.fillStyle)
  };

  // add state
  this.pushState(newState);
};

export { Arc };
