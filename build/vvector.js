var vv = (function (exports) {
'use strict';

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.from = {x: x, y: y};
    this.to = {x: x, y: y};
}

Point.prototype = {
    update: function(time) {
        this.x = this.from.x + (this.to.x - this.from.x) * time;
        this.y = this.from.y + (this.to.y - this.from.y) * time;
    },

    setFrom: function(point) {
        this.from.x = point.x;
        this.from.y = point.y;
    },

    setTo: function(point) {
        this.to.x = point.x;
        this.to.y = point.y;
    },

    switchTo: function(point) {
        // switch target mid-transition
        this.from.x = this.x;
        this.from.y = this.y;
        this.to.x = point.x;
        this.to.y = point.y;
    }
};

function Easing(t, easing) {
    switch (easing) {
        case 'ease-linear':
            return t;
        case 'ease-out':
            return t * t;
        case 'ease-in':
            return 1 - (Math.pow(1 - t, 2));
        case 'ease-in-and-out':
            var tt = t * t;
            return tt / (2 * (tt - t) + 1);
        default:
            return t;
    }
}

function Timer(seconds, easing, automation) {
    this.seconds = seconds;
    this.easing = easing;
    this.automation = automation;
    this.timeStamp = (new Date()).getTime();
}

Timer.prototype = {
    reset: function() {
        this.timeStamp = (new Date()).getTime();
    },

    getTime: function(states) {
        var delta;

        delta = ((new Date()).getTime() - this.timeStamp) / 1000.0;

        if (!this.automation) {
            var clip, t;

            clip = Math.min(this.seconds, delta) / this.seconds;
            t = Easing(clip, this.easing);

            return t;
        }
        else if (this.automation === 'loop') {
            var current, mod, t;

            current = Math.floor(delta / this.seconds) % (states - 1);
            mod = delta % this.seconds;
            t = current + Easing(mod / this.seconds, this.easing);

            return t;
        }
        else if (this.automation === 'oscillate') {
            var current, mod, t, limit;

            current = Math.floor(delta / this.seconds) % ((states - 1) * 2);

            if (current < states - 1) {
                mod = delta % this.seconds;
                t = current + Easing(mod / this.seconds, this.easing);
            } else {
                current = states - 2 - (current - states + 1);
                mod = delta % this.seconds;
                t = current + (1 - Easing(mod / this.seconds, this.easing));
            }

            return t;
        }

    }

};

function Animation(time, easing, automation, first_state) {
    // animation state
    this.fromState = 0;
    this.toState = 0;
    this.states = [first_state];

    // settings
    this.time = time;
    this.easing = easing;
    this.automation = automation;

    // timekeeping
    this.timer = new Timer(this.time, this.easing, this.automation);
    this.time = 0;
}

Animation.prototype = {
    updateAnimation: function() {
        var t = this.timer.getTime(this.states.length);

        // automate states
        if (this.automation && this.states.length > 1) {
            var index = Math.floor(t);

            if (this.fromState !== index || this.toState !== index + 1) {
                this.setFromState(index);
                this.setToState(index + 1);
            }

            t = t % 1;
        }

        this.time = t;
    },

    pushState: function(newState) {
        this.states.push(newState);

        // reset animation
        this.timer.reset();
    },

    setFromState: function(index) {
        var target = this.states[index];

        // set new targets
        for (var prop in target)
            if (prop !== 'label')
                this[prop].setFrom(target[prop]);

        // set index
        this.fromState = index;
    },

    setToState: function(index) {
        var target = this.states[index];

        // set new targets
        for (var prop in target)
            if (prop !== 'label')
                this[prop].setTo(target[prop]);

        // set index
        this.toState = index;
    },

    switchState: function(index) {
        var target = this.states[index];

        // set new target positions
        for (var prop in target)
            if (prop !== 'label')
                this[prop].switchTo(target[prop]);

        // set index
        this.toState = index;

        // reset timer
        this.timer.reset();
    },

    setState: function(label) {
        // search for index with label
        if (this.states[this.toState].label !== label) {
            for (var i=0; i<this.states.length; i++) {
                if (label === this.states[i].label) {
                    this.switchState(i);
                    break;
                }
            }
        }
    }
};

function Line(x1, y1, x2, y2, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x1, y1);
    this.p2 = new Point(x2, y2);

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
            p2: new Point(x2, y2)
        }
    );
}

Line.prototype = Object.create(Animation.prototype);
Line.prototype.constructor = Line;

Line.prototype.draw = function(ctx) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.p2.update(this.time);
    
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

Line.prototype.addState = function(label, x1, y1, x2, y2) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x1, y1),
        p2: new Point(x2, y2)
    });
};

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
    this.cp2.update(this.time);

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

function Rect(x, y, width, height, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x, y);
    this.dimensions = new Point(width, height);

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
            p1: new Point(x, y),
            dimensions: new Point(width, height)
        }
    );
}

Rect.prototype = Object.create(Animation.prototype);
Rect.prototype.constructor = Rect;

Rect.prototype.draw = function(ctx, stroke, fill) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.dimensions.update(this.time);

    if (!this.percentage) {
        if (fill)
            ctx.fillRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
        if (typeof(stroke) === 'undefined' || stroke)
            ctx.strokeRect(this.p1.x, this.p1.y, this.dimensions.x, this.dimensions.y);
    } else {
        var w = ctx.canvas.width,
            h = ctx.canvas.height;

        if (fill)
            ctx.fillRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
        if (typeof(stroke) === 'undefined' || stroke)
            ctx.strokeRect(this.p1.x * w, this.p1.y * h, this.dimensions.x * w, this.dimensions.y * h);
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

function Arc(x, y, radius, startAngle, stopAngle, params) {
    if (typeof(params) === 'undefined') {
        var params = {};
    }

    // coordinates
    this.p1 = new Point(x, y);
    this.radius = new Point(radius, 0);
    this.angle = new Point(startAngle, stopAngle);

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
            p1: new Point(x, y),
            radius: new Point(radius, 0),
            angle: new Point(startAngle, stopAngle)
        }
    );
}

Arc.prototype = Object.create(Animation.prototype);
Arc.prototype.constructor = Arc;

Arc.prototype.draw = function(ctx, stroke, fill) {
    this.updateAnimation();
    this.p1.update(this.time);
    this.radius.update(this.time);
    this.angle.update(this.time);

    ctx.beginPath();
    if (!this.percentage) {
        ctx.arc(this.p1.x, this.p1.y, this.radius.x, this.angle.x, this.angle.y, false);
    } else {
        ctx.arc(this.p1.x * ctx.canvas.width, this.p1.y * ctx.canvas.height, this.radius.x * ctx.canvas.width, this.angle.x, this.angle.y, false);
    }
    if (fill)
        ctx.fill();
    if (typeof(stroke) === 'undefined' || stroke)
        ctx.stroke();
};

Arc.prototype.addState = function(label, x, y, radius, startAngle, stopAngle) {
    // add state
    this.pushState({
        label: label,
        p1: new Point(x, y),
        radius: new Point(radius, 0),
        angle: new Point(startAngle, stopAngle)
    });
};

exports.Line = Line;
exports.Bezier = Bezier;
exports.Rect = Rect;
exports.Arc = Arc;

return exports;

}({}));
//# sourceMappingURL=vvector.js.map
