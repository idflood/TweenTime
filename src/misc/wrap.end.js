    //Register in the values from the outer closure for common dependencies
    //as local almond modules
    define('TweenMax', function () {
        return TweenMax;
    });
    define('TimelineMax', function () {
        return TimelineLite;
    });

    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('TweenTime');
}));