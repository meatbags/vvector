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

var ColourLibrary = {
  'black': 0x0,
  'white': 0xffffff,
  'red': 0xff0000,
  'green': 0x00ff00,
  'blue': 0x0000ff,
  'yellow': 0xffff00,
  'cyan': 0x00ffff,
  'magenta': 0xff00ff
};

function Colour(c) {
  if (typeof(c) === 'string') {
    c = (ColourLibrary[c]) ? ColourLibrary[c] : 0x0;
  }

  this.r = (c >> 16) & 0xff;
  this.g = (c >> 8) & 0xff;
  this.b = (c & 0xff);
  this.from = {r: this.r, b: this.b, g: this.g};
  this.to = {r: this.r, b: this.b, g: this.g};
  this.colour = '#000';
  this.convertColour();
}

Colour.prototype = {
  update: function(time) {
    this.r = this.from.r + (this.to.r - this.from.r) * time;
    this.b = this.from.b + (this.to.b - this.from.b) * time;
    this.g = this.from.g + (this.to.g - this.from.g) * time;
    this.convertColour();
  },

  convertColour: function() {
    var r = this.r,
      b = this.b,
      g = this.g;

    r = ((r < 16) ? '0' : '') + Math.floor(r).toString(16);
    g = ((g < 16) ? '0' : '') + Math.floor(g).toString(16);
    b = ((b < 16) ? '0' : '') + Math.floor(b).toString(16);

    this.colour = '#' + r + g + b;
  },

  setFrom: function(colour) {
    this.from.r = colour.r;
    this.from.g = colour.g;
    this.from.b = colour.b;
  },

  setTo: function(colour) {
    this.to.r = colour.r;
    this.to.g = colour.g;
    this.to.b = colour.b;
  },

  switchTo: function(colour) {
    // switch target
    this.from.r = this.r;
    this.from.b = this.b;
    this.from.g = this.g;
    this.to.r = colour.r;
    this.to.b = colour.b;
    this.to.g = colour.g;
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
    this.animationTime = time;
    this.easing = easing;
    this.automation = automation;

    // timekeeping
    this.timer = new Timer(this.animationTime, this.easing, this.automation);
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

  setAnimation: function(params) {
    this.automation = params.automation || this.automation;
    this.easing = params.easing || this.easing;
    this.animationTime = params.time || this.animationTime;
    this.timer = new Timer(this.animationTime, this.easing, this.automation);
    this.time = 0;
  },

  defaultState: function(defaultState) {
    this.states[0] = defaultState;
    this.timer.reset();
  },

  pushState: function(newState) {
    this.states.push(newState);
    this.timer.reset();
  },

  setFromState: function(index) {
    // set new targets
    var target = this.states[index];

    for (var prop in target)
      if (prop !== 'label')
        this[prop].setFrom(target[prop]);

    // set index
    this.fromState = index;
  },

  setToState: function(index) {
    // set new targets
    var target = this.states[index];

    for (var prop in target)
      if (prop !== 'label')
        this[prop].setTo(target[prop]);

    // set index
    this.toState = index;
  },

  switchState: function(index) {
    // set new target positions
    var target = this.states[index];

    for (var prop in target)
      if (prop !== 'label')
        this[prop].switchTo(target[prop]);

    // set index
    this.toState = index;
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

function CopyParams(prevState, nextState) {
  var newState = {};

  for (var key in prevState) {
    newState[key] = (nextState[key]) ? nextState[key] : prevState[key];
  }

  return newState;
}

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

function Scene(selector, params) {
  if (typeof(params) === 'undefined') {
    var params = {};
  }

  var self = this;
  var newCanvas = (document.getElementById(selector) === null);

  // get canvas
  self.cvs = false;

  if (newCanvas) {
    self.cvs = document.createElement('canvas');
    self.cvs.id = selector;
  } else {
    self.cvs = document.getElementById(selector);
  }

  // get context
  self.ctx = self.cvs.getContext('2d');
  self.cvs.width = params.width || self.cvs.width;
  self.cvs.height = params.height || self.cvs.height;
  self.ctx.strokeRect(0, 0, 100, 100);
  document.body.appendChild(self.cvs);

  // scene contents
  self.content = [];

  // pre and post draw
  self.preDrawFunction = params.preDraw || false;
  self.postDrawFunction = params.postDraw || false;

  // loop
  self.loop = function() {
    window.requestAnimationFrame(self.loop);
    self.ctx.clearRect(0, 0, self.cvs.width, self.cvs.height);

    // draw
    if (self.preDrawFunction)
      self.preDrawFunction();
    self.draw();
    if (self.postDrawFunction)
      self.postDrawFunction();
  };
}

Scene.prototype.setSize = function(width, height) {
  this.cvs.width = width;
  this.cvs.height = height;
};

Scene.prototype.add = function() {
  for (var i=0; i<arguments.length; i+=1) {
    this.content.push(arguments[i]);
  }
};

Scene.prototype.preDraw = function(func) {
  this.preDrawFunction = func;
};

Scene.prototype.postDraw = function(func) {
  this.postDrawFunction = func;
};

Scene.prototype.draw = function() {
  for (var i=0; i<this.content.length; i+=1) {
    this.content[i].draw(this.ctx);
  }
};

exports.Scene = Scene;
exports.Line = Line;
exports.Bezier = Bezier;
exports.Rect = Rect;
exports.Arc = Arc;

return exports;

}({}));
//# sourceMappingURL=vvector.js.map
