(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($http) {
        var CommandManager = function() {
            this.undoStack = [];
            this.redoStack = [];
            this.addCommand = function(execute, undo) {
                this.undoStack.push({execute: execute, undo: undo});
                this.redoStack = [];
                execute();
            };

            this.undo = function() {
                var command = this.undoStack.pop();
                command.undo();
                this.redoStack.push(command);
            };

            this.redo = function() {
                var command = this.redoStack.pop();
                command.execute();
                this.undoStack.push(command);
            };
        };

        var chartCommandManager = new CommandManager();

        var cssFormat = function(colour) {
            return '#' + String('000000' + colour.toString(16)).slice(-6);
        };
        
        var ChartCell = function() {
            var self = this;
            this.colour = "white";
            this.changeColour = function(colour) {
                var previousColour = self.colour;
                chartCommandManager.addCommand(function() {
                    self.colour = cssFormat(colour);
                }, function() {
                    self.colour = previousColour;
                });
            }
        };

        this.cells = [];
        this.colour = 0xFFFFFF;
        this.defaultColours = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFFFFFF];
        this.cssFormat = cssFormat;

        this.selectColour = function(colour) {
            this.colour = colour; 
        };

        this.undo = function() {
            chartCommandManager.undo();
        };

        this.redo = function() {
            chartCommandManager.redo();
        };

        for (var i = 0; i < 8; i++) {
            this.cells[i] = [];
            for (var j = 0; j < 6; j++) {
                this.cells[i][j] = new ChartCell();
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
