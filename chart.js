(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($http) {
        this.colour = "white";

        var self = this;

        this.changeColour = function() {
            var randColour = Math.floor(Math.random() * 0xFFFFFF);
            this.colour = "#" + randColour.toString(16);
        };
    });
})();
