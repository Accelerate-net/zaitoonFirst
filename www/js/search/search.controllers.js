angular.module('zaitoonFirst.search.controllers', [])

.controller('SearchCtrl', function($scope, FoodService, results) {

	$scope.search = { query : 'vegetarian' };
	$scope.products = results;

	$scope.cancelSearch = function(){
		$scope.search = { query : '' };
	};
})


;
