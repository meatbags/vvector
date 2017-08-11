import { Timer } from '../utils/Timer.js';

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

export { Animation };
