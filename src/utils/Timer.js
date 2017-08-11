
import { Easing } from '../maths/Easing.js';

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

            current = Math.floor(delta / this.seconds) % ((states - 1) * 2)

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

export { Timer };
