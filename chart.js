(function() {
    var app = angular.module('chart', []);

    app.controller('ChartController', function($scope) {

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
            if (isNaN(colour)) {
                return colour;
            } else {
                return '#' + String('000000' + colour.toString(16)).slice(-6);
            }
        };
        
        var ChartCell = function(row, column) {
            var self = this;
            this.row = row;
            this.column = column;
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

        $scope.clearCells = function() {
            var commands = [];
            $scope.cells.forEach(function(elementRow) {
                elementRow.forEach(function(elementCell) {
                    var command = elementCell.changeColourCommand(0xFFFFFF);
                    commands.push(command);
                });
            });
            chartCommandManager.addCommand(new CompositeCommand(commands));
        };

        var maxWidth = 800;
        $scope.rows = 0;
        $scope.columns = 0;
        $scope.cells = [];
        $scope.cellDimensions = 30;
        $scope.colour = 0xFFFFFF;
        $scope.defaultColours = [0x000000, 0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFFFFFF];
        $scope.cssFormat = cssFormat;

        $scope.selectColour = function(colour) {
            $scope.colour = colour;
        };

        $scope.undo = chartCommandManager.undo;
        $scope.redo = chartCommandManager.redo;
        $scope.canUndo = chartCommandManager.canUndo;
        $scope.canRedo = chartCommandManager.canRedo;

        $scope.fillRow = function(index) {
            var row = $scope.cells[index];
            var commands = row.map(function(cell) {
                return cell.changeColourCommand($scope.colour);
            });
            chartCommandManager.addCommand(new CompositeCommand(commands));
        };

        $scope.changeColour = function(event, row, column) {
            if(event.ctrlKey) {
                $scope.fillRow(row);
            } else {
                $scope.cells[row][column].changeColour($scope.colour);
            }
        };

        $scope.initChart = function() {
            for (var row = 0; row < $scope.rows; row++) {
                $scope.cells[row] = [];
                for (var column = 0; column < $scope.columns; column++) {
                    $scope.cells[row][column] = new ChartCell(row, column);
                }
            }
            if ($scope.columns * $scope.cellDimensions > maxWidth) {
                $scope.cellDimensions = maxWidth / $scope.columns;
            }
        };

        $scope.cellHeight = function() {
            return $scope.cellDimensions + 'px';
        };


        $scope.cellWidth = function() {
            return $scope.cellDimensions + 'px';
        };
   });
})();
