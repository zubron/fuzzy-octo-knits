(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($http) {
        this.CSSformat = function(colour) {
            return '#' + String('000000' + colour.toString(16)).slice(-6);
        }
        
        var chartCell = function(formatFunction) {
            this.colour = "white";
            this.format = formatFunction;
            this.changeColour = function(colour) {
                this.colour = this.format(colour);
            }
        };

        this.cells = [];
        this.colour = 0xFFFFFF;
        this.defaultColours = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFFFFFF];

        this.selectColour = function(colour) {
            this.colour = colour; 
        }

        for (var i = 0; i < 8; i++) {
            this.cells[i] = [];
            for (var j = 0; j < 6; j++) {
                this.cells[i][j] = (new chartCell(this.CSSformat));
            }
        }
 
        this.clearCells = function() {
            this.cells.forEach(function(elementRow) {
                elementRow.forEach(function(elementCell) {
                    elementCell.changeColour(0xFFFFFF);
                });
            });
        }

        var self = this;
    });
})();
