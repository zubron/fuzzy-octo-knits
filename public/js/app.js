var fuzzyOctoKnitsApp = angular.module('fuzzyOctoKnitsApp', [
    'ngRoute',
    'knittingControllers'
]);

fuzzyOctoKnitsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/create', {
                templateUrl : 'create.html',
                controller: 'ChartController'
            }).
            when('/', {
                templateUrl: 'welcome.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);
