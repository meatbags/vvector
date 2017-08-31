import { ColourLibrary } from './ColourLibrary.js';

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

export { Colour };
