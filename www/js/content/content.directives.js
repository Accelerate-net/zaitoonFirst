angular.module('zaitoonFirst.content.directives', [])

.directive('progressBar', function() {
	return {
		restrict: 'E',
		scope: {
			min: '@',
			max: '@',
			model: '=ngModel'
		},
		replace: true,
		templateUrl: 'views/content/food/progress-bar.template.html'
	};
})

;
