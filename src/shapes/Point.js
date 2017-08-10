import { Easing } from '../maths/Easing.js';

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.start = {x: x, y: y};
    this.target = {x: x, y: y};
    this.timeStamp = 0;
}

Point.prototype = {
    update: function(sec, easing) {
        var t, te;

        t = Math.min(sec, ((new Date()).getTime() - this.timeStamp) / 1000.0) / sec;
        te = Easing(t, easing);

        this.x = this.start.x + (this.target.x - this.start.x) * te;
        this.y = this.start.y + (this.target.y - this.start.y) * te;
    },

    setTarget: function(point) {
        this.timeStamp = (new Date()).getTime();
        this.start.x = this.x;
        this.start.y = this.y;
        this.target.x = point.x;
        this.target.y = point.y;
    }
};

export { Point };
