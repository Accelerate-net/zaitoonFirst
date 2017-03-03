angular.module('zaitoonFirst.shopping-cart.controllers', [])

.controller('ShoppingCartCtrl', function($scope, $ionicLoading, $state, $rootScope, $ionicActionSheet, products, ShoppingCartService, CheckoutService, outletService) {

	//OUTLET INFO
	$scope.outletSelection = outletService.getInfo();
	$scope.deliveryCharge = Math.round($scope.outletSelection['parcelPercentageDelivery']*100);
	$scope.pickupCharge = Math.round($scope.outletSelection['parcelPercentagePickup']*100);
	$scope.taxPercentage = Math.round($scope.outletSelection['taxPercentage']*100);

	//Check if location, outlet are set: if not ask user to set it.
	if($scope.outletSelection.outlet == "" || $scope.outletSelection.location == "" || _.isUndefined(window.localStorage.locationCode)){
		$ionicLoading.show({
			template:  '<i style="color: #FFE800; font-size: 300%"><i class="icon ion-android-alert"></i></i><br>You have not set your location. Please update it before you checkout.',
			duration: 4000
		});
		$scope.isLocationSet = false;
	}
	else{
		$scope.isLocationSet = true;
	}

	//Change location
	$scope.changeLocation = function(){
		window.localStorage.outlet = "";
		window.localStorage.location = "";
		window.localStorage.locationCode = "";
		window.localStorage.backFlagCart = true;
		$state.go('intro.walkthrough-welcome');
	}



	//Take away OR delivery
	$scope.orderType = CheckoutService.getCheckoutMode();

	$scope.setCheckoutMode = function(mode){
		CheckoutService.setCheckoutMode(mode);
		$scope.orderType = mode;
	}


	$scope.products = products;

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

	$scope.tax = 0;
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

	//Go to checkout - validate cart total
	$scope.goCheckout = function(){
		console.log('GO TO CHECKOUT');
		if(_.isUndefined(window.localStorage.locationCode)){
			$ionicLoading.show({
				template:  'Please set your location to Proceed',
				duration: 2000
			});
		}
		else{
			if($scope.orderType == 'delivery'){ //Check for minimum order criteria
				var total = this.getSubtotal();
				var min = $scope.outletSelection['minAmount'];
				if(total >= min){
					$state.go('main.app.checkout');
				}
				else{
					$ionicLoading.show({
						template:  '<b style="color: #FFE800; font-size: 160%">Oops!</b><br>The minimum order amount is Rs. '+min,
						duration: 3000
					});
				}
			}
			else{
				$state.go('main.app.checkout');
			}
		}

	}
})


;
