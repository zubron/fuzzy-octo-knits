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

            self.addCommandPair = function(execute, undo) {
                self.addCommand({execute: execute, undo: undo});
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

        var CompositeCommand = function(executeCommands, undoCommands) {
            var self = this;
            self.executeCommands = executeCommands;
            self.undoCommands = undoCommands;

            self.execute = function() {
                self.executeCommands.map(function(execute) {
                    execute();
                });
            };

            self.undo = function () {
                self.undoCommands.map(function(undo) {
                    undo();
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
                chartCommandManager.addCommandPair(command.execute, command.undo);
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
            var executeCommands = [];
            var undoCommands = [];
            self.cells.forEach(function(elementRow) {
                elementRow.forEach(function(elementCell) {
                    var command = elementCell.changeColourCommand(0xFFFFFF);
                    executeCommands.push(command.execute);
                    undoCommands.push(command.undo);
                });
            });
            chartCommandManager.addCommand(new CompositeCommand(executeCommands, undoCommands));
        }

        self.cells = [];
        self.colour = 0xFFFFFF;
        self.defaultColours = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFFFFFF];
        self.cssFormat = cssFormat;

        self.selectColour = function(colour) {
            self.colour = colour; 
        };

        self.undo = function() {
            chartCommandManager.undo();
        };

        self.redo = function() {
            chartCommandManager.redo();
        };

        self.canUndo = function() {
            return chartCommandManager.canUndo();
        };

        self.canRedo = function() {
            return chartCommandManager.canRedo();
        };

        for (var i = 0; i < 8; i++) {
            self.cells[i] = [];
            for (var j = 0; j < 6; j++) {
                self.cells[i][j] = new ChartCell();
            }
        }
 
   });
})();
