var vv = (function (exports) {
'use strict';

const Easing = (t, easing) => {
    switch (easing) {
        case 'ease-linear':
            return t;
            break;
        default:
            return t;
    }
};

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

    setTarget: function(x, y) {
        this.timeStamp = (new Date()).getTime();
        this.start.x = this.x;
        this.start.y = this.y;
        this.target.x = x;
        this.target.y = y;
    }
};

function Line(x1, y1, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.state = {
        'default': {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        }
    };
}

Line.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.p2.update(this.animationTime, this.easing);
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    },

    addState: function(label, x1, y1, x2, y2, params) {
        this.state[label] = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };
    },

    setState: function(label) {
        var target = this.state[label] || this.state['default'];

        this.p1.setTarget(target.x1, target.y1);
        this.p2.setTarget(target.x2, target.y2);
    },

    rateOfChange: function(t) {
        if (typeof(t) !== 'undefined') {
            this.rateOfChange = t;
        } else {
            return this.rateOfChange;
        }
    },

    easing: function(e) {
        if (typeof(e) !== 'undefined') {
            this.easing = e;
        } else {
            return this.easing;
        }
    },
};

exports.Line = Line;

return exports;

}({}));
//# sourceMappingURL=vvector.js.map
