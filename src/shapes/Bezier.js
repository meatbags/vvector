import { Point } from './Point.js';
import { Colour } from '../styles/Colour.js';
import { Animation } from '../core/Animation.js';
import { CopyParams } from '../utils/Params.js';

function Bezier(params) {
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
      cp1x: params.cp1x || 0,
      cp1y: params.cp1y || 0,
      cp2x: params.cp2x || 0,
      cp2y: params.cp2y || 0,
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
    this.p1 = new Point(this.defaults.x1, this.defaults.y1);
    this.p2 = new Point(this.defaults.x2, this.defaults.y2);
    this.cp1 = new Point(this.defaults.cp1x, this.defaults.cp1y);
    this.cp2 = new Point(this.defaults.cp2x, this.defaults.cp2y);

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
            p1: new Point(this.defaults.x1, this.defaults.y1),
            p2: new Point(this.defaults.x2, this.defaults.y2),
            cp1: new Point(this.defaults.cp1x, this.defaults.cp1y),
            cp2: new Point(this.defaults.cp2x, this.defaults.cp2y),
            lineWidth: new Point(this.defaults.lineWidth, 0),
            strokeStyle: new Colour(this.defaults.strokeStyle),
            fillStyle: new Colour(this.defaults.fillStyle)
        }
    );
}

Bezier.prototype = Object.create(Animation.prototype);
Bezier.prototype.constructor = Bezier;

Bezier.prototype.draw = function(ctx) {
    this.updateAnimation();

    this.p1.update(this.time);
    this.p2.update(this.time);
    this.cp1.update(this.time);
    this.cp2.update(this.time);
    this.lineWidth.update(this.time);
    this.strokeStyle.update(this.time);
    this.fillStyle.update(this.time);

    ctx.beginPath();
    if (!this.percentage) {
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.p2.x, this.p2.y);
    } else {
        var w = ctx.canvas.width,
          h = ctx.canvas.height;

        ctx.moveTo(this.p1.x * w, this.p1.y * h);
        ctx.bezierCurveTo(this.cp1.x * w, this.cp1.y * h, this.cp2.x * w, this.cp2.y * h, this.p2.x * w, this.p2.y * h);
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

Bezier.prototype.addState = function(params) {
  var newParams = CopyParams(this.defaults, params);
  var newState = {
    label: newParams.label,
    p1: new Point(newParams.x1, newParams.y1),
    p2: new Point(newParams.x2, newParams.y2),
    cp1: new Point(newParams.cp1x, newParams.cp1y),
    cp2: new Point(newParams.cp2x, newParams.cp2y),
    lineWidth: new Point(newParams.lineWidth, 0),
    strokeStyle: new Colour(newParams.strokeStyle),
    fillStyle: new Colour(newParams.fillStyle)
  };

  // add state
  this.pushState(newState);
};

export { Bezier };
