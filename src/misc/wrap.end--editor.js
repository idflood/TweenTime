    //Register in the values from the outer closure for common dependencies
    //as local almond modules
    define('jquery', function () {
        return $;
    });
    define('lodash', function () {
        return _;
    });
    define('d3', function () {
        return d3;
    });
    define('jquery', function () {
        return jQuery;
    });
    define('Mustache', function () {
        return Mustache;
    });
    define('draggablenumber', function () {
        return DraggableNumber;
    });
    /*define('Signal', function () {
        return Signals;
    });*/

    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('Editor');
}));