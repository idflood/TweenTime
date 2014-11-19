(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['jquery', 'lodash', 'd3', 'jquery', 'Mustache', 'draggablenumber'], factory);
    } else {
        // Browser globals
        root.Editor = factory(root.$, root._, root.d3, root.jQuery, root.Mustache, root.DraggableNumber);
    }
}(this, function ($, _, d3, jQuery, Mustache, DraggableNumber) {
