(function () {
    var module = angular.module('graph');
    module.directive('graph', function () {
        return {
            controller: 'graphController',
            templateUrl: './modules/graph/graph.directive.html',
            scope: {
                onSelection: '='
            },
            link: function (scope, element) {
            }
        }
    });
})();
