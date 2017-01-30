angular.module('zaitoonFirst.shopping-cart.directives', [])

.directive('testDirective', function($timeout) {
	return {
		restrict: 'A',
		scope: {
		},
		controller: function($scope) {

		},
		link: function(scope, element, attr, ctrl) {

		}
	};
})

.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-positive-zaitoon');
        if (newVal === scope.value) {
          element.addClass('button-positive-zaitoon');
        }
      });
    }
  };
})


;
