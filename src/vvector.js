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
  self.ctx.strokeRect(0, 0, 100, 100)
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
  }
};

Scene.prototype.setSize = function(width, height) {
  this.cvs.width = width;
  this.cvs.height = height;
}

Scene.prototype.add = function() {
  for (var i=0; i<arguments.length; i+=1) {
    this.content.push(arguments[i]);
  }
}

Scene.prototype.preDraw = function(func) {
  this.preDrawFunction = func;
}

Scene.prototype.postDraw = function(func) {
  this.postDrawFunction = func;
}

Scene.prototype.draw = function() {
  for (var i=0; i<this.content.length; i+=1) {
    this.content[i].draw(this.ctx);
  }
}

export { Line } from './shapes/Line.js';
export { Bezier } from './shapes/Bezier.js';
export { Rect } from './shapes/Rect.js';
export { Arc } from './shapes/Arc.js';
export { Scene };
