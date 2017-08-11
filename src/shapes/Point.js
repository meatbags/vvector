
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

export { Point };
