(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($http) {
        var chartCell = function() {
            this.colour = "white";
            this.changeColour = function() {
                var randColour = Math.floor(Math.random() * 0xFFFFFF);
                this.colour = "#" + randColour.toString(16);
            }
        };

        this.cells = [];

        for (var i = 0; i < 8; i++) {
            this.cells[i] = [];
            for (var j = 0; j < 6; j++) {
                this.cells[i][j] = (new chartCell());
            }
        }
 
        var self = this;

        this.changeColour = function() {
            var randColour = Math.floor(Math.random() * 0xFFFFFF);
            this.colour = "#" + randColour.toString(16);
        };
    });
})();
