(function () {
  var module = angular.module('graph');
  module.directive('graphLabel', function () {
    return {
      templateUrl: './modules/graph/graph-label.directive.html',
      link: function (scope, element) {
      }
    }
  });
})();
