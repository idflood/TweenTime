(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['TweenMax', 'TimelineMax'], factory);
    } else {
        // Browser globals
        root.TweenTime = factory(root.TweenMax, root.TimelineLite);
    }
}(this, function (TweenMax, TimelineLite) {
