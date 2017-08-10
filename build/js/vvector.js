var vv = (function (exports) {
'use strict';

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

function Line(x1, y1, x2, y2) {
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
    update: function(rate) {
        this.p1.update(rate);
        this.p2.update(rate);
    },

    stroke: function(ctx) {
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
    }
};

exports.Line = Line;

return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnZlY3Rvci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NoYXBlcy9Qb2ludC5qcyIsIi4uLy4uL3NyYy9zaGFwZXMvTGluZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBQb2ludCh4LCB5KSB7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMudGFyZ2V0ID0ge3g6IHgsIHk6IHl9O1xyXG59XHJcblxyXG5Qb2ludC5wcm90b3R5cGUgPSB7XHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKHJhdGUpIHtcclxuICAgICAgICB0aGlzLnggKz0gKHRoaXMudGFyZ2V0LnggLSB0aGlzLngpICogcmF0ZTtcclxuICAgICAgICB0aGlzLnkgKz0gKHRoaXMudGFyZ2V0LnkgLSB0aGlzLnkpICogcmF0ZTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0VGFyZ2V0OiBmdW5jdGlvbih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQueCA9IHg7XHJcbiAgICAgICAgdGhpcy50YXJnZXQueSA9IHk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgeyBQb2ludCB9O1xyXG4iLCJpbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vUG9pbnQuanMnO1xyXG5cclxuZnVuY3Rpb24gTGluZSh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgdGhpcy5wMSA9IG5ldyBQb2ludCh4MSwgeTEpO1xyXG4gICAgdGhpcy5wMiA9IG5ldyBQb2ludCh4MiwgeTIpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAnZGVmYXVsdCc6IHtcclxuICAgICAgICAgICAgeDE6IHgxLFxyXG4gICAgICAgICAgICB5MTogeTEsXHJcbiAgICAgICAgICAgIHgyOiB4MixcclxuICAgICAgICAgICAgeTI6IHkyXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5MaW5lLnByb3RvdHlwZSA9IHtcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24ocmF0ZSkge1xyXG4gICAgICAgIHRoaXMucDEudXBkYXRlKHJhdGUpO1xyXG4gICAgICAgIHRoaXMucDIudXBkYXRlKHJhdGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdHJva2U6IGZ1bmN0aW9uKGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKHRoaXMucDEueCwgdGhpcy5wMS55KTtcclxuICAgICAgICBjdHgubGluZVRvKHRoaXMucDIueCwgdGhpcy5wMi55KTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZFN0YXRlOiBmdW5jdGlvbihsYWJlbCwgeDEsIHkxLCB4MiwgeTIsIHBhcmFtcykge1xyXG4gICAgICAgIHRoaXMuc3RhdGVbbGFiZWxdID0ge1xyXG4gICAgICAgICAgICB4MTogeDEsXHJcbiAgICAgICAgICAgIHkxOiB5MSxcclxuICAgICAgICAgICAgeDI6IHgyLFxyXG4gICAgICAgICAgICB5MjogeTJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFN0YXRlOiBmdW5jdGlvbihsYWJlbCkge1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLnN0YXRlW2xhYmVsXSB8fCB0aGlzLnN0YXRlWydkZWZhdWx0J107XHJcblxyXG4gICAgICAgIHRoaXMucDEuc2V0VGFyZ2V0KHRhcmdldC54MSwgdGFyZ2V0LnkxKTtcclxuICAgICAgICB0aGlzLnAyLnNldFRhcmdldCh0YXJnZXQueDIsIHRhcmdldC55Mik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgeyBMaW5lIH07XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFTLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWCxJQUFJLENBQUMsTUFB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