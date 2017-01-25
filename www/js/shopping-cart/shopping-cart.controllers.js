angular.module('zaitoonFirst.shopping-cart.controllers', [])

.controller('ShoppingCartCtrl', function($scope, $state, $rootScope, $ionicActionSheet, products, ShoppingCartService) {

	$scope.products = products;
	var tax = 0.07;

	$scope.$on('cart_updated', function(event, cart_products) {
    $scope.products = cart_products;
  });


	$scope.close = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  	};

  	//Remove Item from Cart
	$scope.removeFromCart = function(product) {
		$ionicActionSheet.show({
			titleText: 'Remove '+product.name+' from the Cart',
			destructiveText: 'Remove from Cart',
			cancelText: 'Cancel',
			cancel: function() {
				return true;
			},
			destructiveButtonClicked: function() {
				ShoppingCartService.removeProduct(product);
				return true;
			}
		});
	};

	//Increase item count
	$scope.addCount = function(product) {
		console.log(product);
		ShoppingCartService.addProduct(product);
	};

	//Decrease Item count
	$scope.lessCount = function(product) {
		ShoppingCartService.lessProduct(product);
	};

	//update product quantities
	$scope.$watch('subtotal', function() {
		var updatedProducts = $scope.products;
		ShoppingCartService.updatedProducts(updatedProducts);
	});


	$scope.getSubtotal = function() {
		$scope.subtotal = _.reduce($scope.products, function(memo, product){
			return memo + (product.itemPrice * product.qty);
		}, 0);

		return $scope.subtotal;
	};

	$scope.getTax = function() {
		$scope.tax = $scope.subtotal * tax;
		return $scope.tax;
	};

	$scope.getTotal = function() {
		return $scope.subtotal + $scope.tax;
	};
})


;
