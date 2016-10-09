(function () {
  var module = angular.module('editor');
  module.controller('editorController', function ($scope) {
    $scope.clone = null;
    $scope.$watch('selectedNode', function (n, o) {
      $scope.clone = n === null ? null : angular.copy(n);
    });

    $scope.applyChanges = function () {
      $scope.selectedNode.name = $scope.clone.name;
    }
  });
})();
