var vv = (function (exports) {
'use strict';

function Easing(t, easing) {
    switch (easing) {
        case 'ease-linear':
            return t;
        case 'ease-out':
            return t * t;
        case 'ease-in':
            return 1 - (Math.pow(1 - t, 2));
        default:
            return t;
    }
}

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

function Line(x1, y1, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2)
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
            p1: new Point(x1, y1),
            p2: new Point(x2, y2)
        };
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.p2.setTarget(target.p2);
        }
    }
};

function Bezier(x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);
    this.cp1 = new Point(cp1x, cp1y);
    this.cp2 = new Point(cp2x, cp2y);
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2),
            cp1: new Point(cp1x, cp1y),
            cp2: new Point(cp2x, cp2y)
        }
    };
}

Bezier.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.p2.update(this.animationTime, this.easing);
        this.cp1.update(this.animationTime, this.easing);
        this.cp2.update(this.animationTime, this.easing);
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.p2.x, this.p2.y);
        ctx.stroke();
    },

    addState: function(label, x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, params) {
        this.state[label] = {
            p1: new Point(x1, y1),
            p2: new Point(x2, y2),
            cp1: new Point(cp1x, cp1y),
            cp2: new Point(cp2x, cp2y)
        };
    },

    setState: function(label) {
        if (this.state.current !== label &&  this.state[label]) {
            var target =  this.state[label];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.p2.setTarget(target.p2);
            this.cp1.setTarget(target.cp1);
            this.cp2.setTarget(target.cp2);
        }
    }
};

function Rect(x, y, width, height, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x, y);
    this.dimensions = new Point(width, height);
    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    };
}

Rect.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.dimensions.update(this.animationTime, this.easing);
        ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
    },

    addState: function(label, x, y, width, height, params) {
        this.state[label] = {
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        };
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.dimensions.setTarget(target.dimensions);
        }
    }
};

function Arc(x, y, radius, startAngle, stopAngle) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    this.animationTime = params.animationTime || 1.0;
    this.easing = params.easing || 'ease-linear';
    this.p1 = new Point(x, y);
    this.radius = new Point(radius, 0);
    this.angle = new Point(startAngle, stopAngle);

    this.state = {
        current: 'default',
        'default': {
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        }
    };
}

Arc.prototype = {
    draw: function(ctx) {
        this.p1.update(this.animationTime, this.easing);
        this.radius.update(this.animationTime, this.easing);
        this.angle.update(this.animationTime, this.easing);
        ctx.beginPath();
        //ctx.moveTo(this.p1.x, this.p1.y);
        ctx.arc(this.p1.x, this.p1.y, this.radius.x, this.angle.x, this.angle.y, false);
        ctx.stroke();
    },

    addState: function(label, x, y, radius, startAngle, stopAngle, params) {
        this.state[label] = {
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        };
    },

    setState: function(label) {
        if (this.state.current !== label) {
            var target = this.state[label] || this.state['default'];

            this.state.current = (this.state[label]) ? label : 'default';
            this.p1.setTarget(target.p1);
            this.radius.setTarget(target.radius);
            this.angle.setTarget(target.angle);
        }
    }
};

exports.Line = Line;
exports.Bezier = Bezier;
exports.Rect = Rect;
exports.Arc = Arc;

return exports;

}({}));
