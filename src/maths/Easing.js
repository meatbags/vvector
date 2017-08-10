function Easing(t, easing) {
    switch (easing) {
        case 'ease-linear':
            return t;
        case 'ease-out':
            return t * t;
        case 'ease-in':
            return 1 - (Math.pow(1 - t, 2));
        default:
            return t;
    }
};

export { Easing };
