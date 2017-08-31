import { Point } from './Point.js';
import { Colour } from '../styles/Colour.js';
import { Animation } from '../core/Animation.js';
import { CopyParams } from '../utils/Params.js';

function Rect(params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // set defaults
    this.defaults = {
      label: params.label || 'default',
      x: params.x || 0,
      y: params.y || 0,
      width: params.width || 1,
      height: params.height || 1,
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
    this.dimensions = new Point(this.defaults.width, this.defaults.height);

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
            dimensions: new Point(this.defaults.width, this.defaults.height),
            lineWidth: new Point(this.defaults.lineWidth, 0),
            strokeStyle: new Colour(this.defaults.strokeStyle),
            fillStyle: new Colour(this.defaults.fillStyle)
        }
    );
}

Rect.prototype = Object.create(Animation.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.draw = function(ctx) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.dimensions.update(this.time);
    this.lineWidth.update(this.time);
    this.strokeStyle.update(this.time);
    this.fillStyle.update(this.time);

    if (!this.percentage) {
        if (this.fill) {
            ctx.fillStyle = this.fillStyle.colour;
            ctx.fillRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        } if (this.stroke) {
          ctx.strokeStyle = this.strokeStyle.colour;
          ctx.lineWidth = this.lineWidth.x;
            ctx.lineCap = 'round';
            ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        }
    } else {
        var w = ctx.canvas.width,
            h = ctx.canvas.height;

        if (this.fill) {
            ctx.fillStyle = this.fillStyle.colour;
            ctx.fillRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
        }
        if (this.stroke) {
            ctx.strokeStyle = this.strokeStyle.colour;
            ctx.lineWidth = this.lineWidth.x;
            ctx.lineCap = 'round';
            ctx.strokeRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
        }
    }
};

Rect.prototype.addState = function(params) {
  var newParams = CopyParams(this.defaults, params);
  var newState = {
    label: newParams.label,
    p1: new Point(newParams.x, newParams.y),
    dimensions: new Point(newParams.width, newParams.height),
    lineWidth: new Point(newParams.lineWidth, 0),
    strokeStyle: new Colour(newParams.strokeStyle),
    fillStyle: new Colour(newParams.fillStyle)
  };

  // add state
  this.pushState(newState);
};

export { Rect };
