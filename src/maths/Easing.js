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
};

export { Easing };
