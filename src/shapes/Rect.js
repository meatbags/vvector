import { Point } from './Point.js';
import { Animation } from '../core/Animation.js';

function Rect(x, y, width, height, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x, y);
    this.dimensions = new Point(width, height)

    // settings
    this.percentage = params.percentageCoords || false;

    // style
    this.stroke = params.stroke || true;
    this.fill = (params.fillStyle || params.fill == true) ? true : false;
    this.strokeStyle = params.strokeStyle || '#000';
    this.lineWidth = params.lineWidth || 1;
    this.fillStyle = params.fillStyle || '#fff';

    // animation
    Animation.call(
        this,
        params.time || 1.0,
        params.easing || 'ease-linear',
        params.automation || false,
        {
            label: 'default',
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    );
}

Rect.prototype = Object.create(Animation.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.draw = function(ctx) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.dimensions.update(this.time);

    if (!this.percentage) {
        if (this.fill) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        } if (this.stroke) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        }
    } else {
        var w = ctx.canvas.width,
            h = ctx.canvas.height;

        if (this.fill) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
        }
        if (this.stroke) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
        }
    }
};

Rect.prototype.addState = function(label, x, y, width, height, params) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x, y),
        dimensions: new Point(width, height)
    });
};

export { Rect };
