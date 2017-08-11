import { Point } from './Point.js';
import { Animation } from '../core/Animation.js';

function Bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.cp1 = new Point(cp1x, cp1y);
    this.cp2 = new Point(cp2x, cp2y);

    // settings
    this.percentage = params.percentageCoords || false;

    // animation
    Animation.call(
        this,
        params.time || 1.0,
        params.easing || 'ease-linear',
        params.automation || false,
        {
            label: 'default',
            p1: new Point(x1, y1),
            p2: new Point(x2, y2),
            cp1: new Point(cp1x, cp1y),
            cp2: new Point(cp2x, cp2y)
        }
    );
}

Bezier.prototype = Object.create(Animation.prototype);
Bezier.prototype.constructor = Bezier;

Bezier.prototype.draw = function(ctx, stroke, fill) {
    this.updateAnimation();

    this.p1.update(this.time);
    this.p2.update(this.time);
    this.cp1.update(this.time);
    this.cp2.update(this.time)

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

    if (fill)
        ctx.fill();
    if (typeof(stroke) === 'undefined' || stroke)
        ctx.stroke();
};

Bezier.prototype.addState = function(label, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x1, y1),
        p2: new Point(x2, y2),
        cp1: new Point(cp1x, cp1y),
        cp2: new Point(cp2x, cp2y)
    });
};

export { Bezier };
