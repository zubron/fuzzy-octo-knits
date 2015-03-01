(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($http) {
        var self = this;

        var CommandManager = function() {
            var self = this;
            self.undoStack = [];
            self.redoStack = [];

            self.addCommand = function(command) {
                self.undoStack.push(command);
                self.redoStack = [];
                command.execute();
            };

            self.undo = function() {
                var command = self.undoStack.pop();
                command.undo();
                self.redoStack.push(command);
            };

            self.redo = function() {
                var command = self.redoStack.pop();
                command.execute();
                self.undoStack.push(command);
            };

            self.canUndo = function() {
                return self.undoStack.length !== 0;
            };

            self.canRedo = function() {
                return self.redoStack.length !== 0;
            };
        };

        var chartCommandManager = new CommandManager();

        var CompositeCommand = function(commands) {
            var self = this;
            self.commands = commands;

            self.execute = function() {
                self.commands.forEach(function(command) {
                    command.execute();
                });
            };

            self.undo = function () {
                self.commands.forEach(function(command) {
                    command.undo();
                });
            };
        };

        var cssFormat = function(colour) {
            return '#' + String('000000' + colour.toString(16)).slice(-6);
        };
        
        var ChartCell = function() {
            var self = this;
            self.colour = cssFormat(0xFFFFFF);
            self.changeColour = function(colour) {
                var command = self.changeColourCommand(colour);
                chartCommandManager.addCommand(command);
            };

            self.changeColourCommand = function(colour) {
                var previousColour = self.colour;
                return {
                    execute: function() {
                        self.colour = cssFormat(colour);
                    },
                    undo: function() {
                        self.colour = previousColour;
                    }
                };
            };
        };

        self.clearCells = function() {
            var commands = [];
            self.cells.forEach(function(elementRow) {
                elementRow.forEach(function(elementCell) {
                    var command = elementCell.changeColourCommand(0xFFFFFF);
                    commands.push(command);
                });
            });
            chartCommandManager.addCommand(new CompositeCommand(commands));
        }

        self.cells = [];
        self.colour = 0xFFFFFF;
        self.defaultColours = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFFFFFF];
        self.cssFormat = cssFormat;

        self.selectColour = function(colour) {
            self.colour = colour; 
        };

        self.undo = chartCommandManager.undo;
        self.redo = chartCommandManager.redo;
        self.canUndo = chartCommandManager.canUndo;
        self.canRedo = chartCommandManager.canRedo;

        for (var i = 0; i < 8; i++) {
            self.cells[i] = [];
            for (var j = 0; j < 6; j++) {
                self.cells[i][j] = new ChartCell();
            }
        }
 
   });
})();
