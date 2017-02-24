angular.module('zaitoonFirst.shopping-cart.controllers', [])

.controller('ShoppingCartCtrl', function($scope, $state, $rootScope, $ionicActionSheet, products, ShoppingCartService, CheckoutService, outletService) {

	//OUTLET INFO
	$scope.outletSelection = outletService.getInfo();

	//Take away OR delivery
	$scope.orderType = CheckoutService.getCheckoutMode();

	$scope.setCheckoutMode = function(mode){
		CheckoutService.setCheckoutMode(mode);
		$scope.orderType = mode;
	}


	$scope.products = products;
	if($scope.orderType == 'delivery'){
		$scope.taxPercentage = 0.07;
	}
	else{
		$scope.taxPercentage = 0.05;
	}

	$scope.$on('cart_updated', function(event, cart_products) {
    	$scope.products = cart_products;
  	});


	$scope.close = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  	};

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

	$scope.addCount = function(product) {
		console.log(product);
		ShoppingCartService.addProduct(product);
	};

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
		$scope.tax = $scope.subtotal * $scope.outletSelection['taxPercentage'];
		return $scope.tax;
	};

	$scope.getParcel = function() {
		if($scope.orderType == 'delivery'){
			$scope.parcel = $scope.subtotal * $scope.outletSelection['parcelPercentageDelivery'];
		}
		else{
			$scope.parcel = $scope.subtotal * $scope.outletSelection['parcelPercentagePickup'];
		}
		return $scope.parcel;
	};

	$scope.getTotal = function() {
		return $scope.subtotal + $scope.tax + $scope.parcel;
	};
})


;
