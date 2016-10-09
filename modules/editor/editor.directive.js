(function () {
    var module = angular.module('editor');
    module.directive('editor', function () {
        return {
            controller: 'editorController',
            templateUrl: './modules/editor/editor.directive.html',
            scope: {
                selectedNode: '=',
                onNodeUpdated: '='
            },
            link: function (scope, element) {
            }
        }
    });
})();
