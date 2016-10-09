angular.module('main').controller('mainController', function ($scope, $timeout) {
  $scope.selectedNode = null;
  $scope.showSideBar = false;

  $scope.onNodeSelected = function (node, selected) {
    $scope.showSideBar = selected;
    $scope.finallyShownSideBar = false;
    if (selected) {
      $scope.selectedNode = node;
    }
    $timeout(function () {
      $scope.finallyShownSideBar = selected;
      if (!selected) {
        $scope.selectedNode = null;
      }
      $scope.selectedNode = selected ? node : null;
    }, 300);
  };

});
