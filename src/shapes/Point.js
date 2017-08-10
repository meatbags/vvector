function Point(x, y) {
    this.x = x;
    this.y = y;
    this.target = {x: x, y: y};
}

Point.prototype = {
    update: function(rate) {
        this.x += (this.target.x - this.x) * rate;
        this.y += (this.target.y - this.y) * rate;
    },

    setTarget: function(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
};

export { Point };
