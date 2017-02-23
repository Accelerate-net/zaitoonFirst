angular.module('zaitoonFirst.shopping-cart.controllers', [])

.controller('ShoppingCartCtrl', function($scope, $state, $rootScope, $ionicActionSheet, products, ShoppingCartService, CheckoutService) {

	//Take away OR delivery
	$scope.orderType = CheckoutService.getCheckoutMode();

	$scope.setCheckoutMode = function(mode){
		CheckoutService.setCheckoutMode(mode);
	}


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
			buttons: [
        { text: '<i class="icon ion-trash-a assertive"></i> <i class="assertive">Remove from the Cart</i>' },
        { text: '<i class="icon"></i> <i class="dark">Cancel</i>' },
      ],
			titleText: 'Remove '+product.itemName+' from the Cart?',
			buttonClicked: function(index) {
				if(index == 0){
					ShoppingCartService.removeProduct(product);
				}
        return true;
      },
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
