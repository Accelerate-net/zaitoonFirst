angular.module('zaitoonFirst.deals-cart.controllers', [])

.controller('DealsCartCtrl', function($scope, $ionicLoading, $state, $http, ProfileService, $rootScope, $ionicActionSheet, products, DealsCartService, outletService) {

	$scope.products = products;
	
 //User Info
 $rootScope.user = "";
 ProfileService.getUserData()
 .then(function(response){
   $rootScope.user = response;
 })

 

	$scope.$on('deals_cart_updated', function(event, cart_products) {
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
					DealsCartService.removeProduct(product);
				}
        return true;
      },
		});
	};

	$scope.addCount = function(product) {
		DealsCartService.addProduct(product);
	};

	$scope.lessCount = function(product) {
		DealsCartService.lessProduct(product);
	};

	//update product quantities
	$scope.$watch('subtotal', function() {
		var updatedProducts = $scope.products;
		DealsCartService.updatedProducts(updatedProducts);
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
		return Math.ceil($scope.tax);
	};

	$scope.getOther = function() {
		$scope.other = 0;
		return $scope.other;
		//return Math.ceil($scope.other);
	};

	$scope.getTotal = function() {
		return $scope.subtotal + Math.ceil($scope.other);
	};
	
	
	
	
	$scope.getItemStyle = function(deal){
		
		var style = {
				"margin-bottom": "15px", 
				"padding": "4px 2px",
				"background": "#303335", 
				"color": "#fff",
				"border": "2px dashed #4b4f52",
				"border-radius":" 10px",
				"box-shadow": "0 0 0 4px #303335, 2px 1px 4px 3px rgba(10, 10, 0, 0.3)"
		}

			
		if(deal.isImageAvailable == 1){
			style = {
				"margin-bottom": "15px", 
				"background": "#303335", 
				"color": "#fff",
				"border": "none",
				"padding" : "0",
				"border-radius":" 10px",
				"box-shadow": "0 0 0 4px #303335, 2px 1px 4px 3px rgba(10, 10, 0, 0.3)"
			}			
		}
		return style;
	}
	
	
	
	
  //RAZORPAY INTEGRATION
  var called = false

  var successCallback = function(payment_id) {
    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;
    data.orderID = $scope.orderID;
    data.transactionID = payment_id;

    $http({
      method  : 'POST',
      url     : 'https://www.zaitoon.online/services/processpasspayment.php',
      data    : data,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      timeout : 10000
     })
    .success(function(response) {
      if(response.status){
        window.localStorage.removeItem("zaitoonFirst_dealsCart");
        $state.go('main.app.checkout.orders');
      }
      else{
        $ionicLoading.show({
          template:  'Something went wrong. The order was not placed.',
          duration: 3000
        });
      }
    })
    .error(function(data){
        $ionicLoading.show({
          template:  "Order was not placed due to network error.",
          duration: 3000
        });
    });

    called = false
  };

  var cancelCallback = function(error) {

    $ionicLoading.show({
      template:  '<b style="color: #e74c3c; font-size: 150%">Error'+'</b><br>'+error.description,
      duration: 3000
    });

    called = false
  };

  //$ionicPlatform.ready(function(){
    $scope.placeOrder = function() {

      if($scope.isOfflineFlag){
        $ionicLoading.show({
          template:  'Please connect to Internet',
          duration: 2000
        });
      }
	  
        if (!called) {

          //Step 1 - Create ORDER
          //Create Order
          var data = {};
          data.token = JSON.parse(window.localStorage.user).token;
          data.outlet = window.localStorage.outlet;
		  
          var formattedcart = {};
          formattedcart.cartTotal = this.getSubtotal();
          formattedcart.cartExtra = this.getOther();
		  
          
		  
		  var temp_cart = JSON.parse(window.localStorage.zaitoonFirst_dealsCart);
		  for (var key in temp_cart) {
			  delete temp_cart[key].type;
			  delete temp_cart[key].code;
			  delete temp_cart[key].description;
			  delete temp_cart[key].isImageAvailable;
			  delete temp_cart[key].isAppOnly;
			  delete temp_cart[key].isPurchasable;
			  delete temp_cart[key].url;
			  delete temp_cart[key].validTill;
			  delete temp_cart[key].custom;			  
		  }
		  
		  formattedcart.items = temp_cart;
		  
		  
          data.cart = formattedcart;
          data.platform = "MOB";
		  
		  console.log(data)

          $http({
            method  : 'POST',
            url     : 'https://www.zaitoon.online/services/createpassorder.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            timeout : 10000,
           })
          .success(function(response) {
			  console.log(response)
            if(!response.status){
              $ionicLoading.show({
                template:  '<b style="color: #e74c3c; font-size: 150%">Error!</b><br>'+response.error,
                duration: 3000
              });
            }
            else{
              if(response.isPrepaidAllowed){
                $scope.orderID = response.orderid;
                //Payment options
                var options = {
                  description: 'Payment for Order #'+response.orderid,
                  image: 'https://zaitoon.online/services/images/razor_icon.png',
                  currency: 'INR',
                  key: $scope.razorpayKey,
                  amount: response.amount*100,
                  name: 'Zaitoon Online',
                  prefill: {
                    email: $rootScope.user.email,
                    contact: $rootScope.user.mobile,
                    name: $rootScope.user.name
                  },
                  theme: {
                    color: '#e74c3c'
                  }
                };

                //Step 2 - Make Payment
                RazorpayCheckout.open(options, successCallback, cancelCallback);
                called = true
              }
              else{
                $ionicLoading.show({
                  template:  '<b style="color: #e74c3c; font-size: 150%">Sorry!</b><br>Online payment is not available. Please opt for Cash on Delivery (COD)',
                  duration: 3000
                });
              }
            }
          })
          .error(function(data){
              $ionicLoading.show({
                template:  "Not responding. Check your connection.",
                duration: 3000
              });
          });


        }
    }
  //});
	

	
	
	

})




.controller('ViewPassesCtrl', function($scope, $ionicLoading, $ionicPopup, $state, $http, ProfileService, $rootScope, $ionicActionSheet, DealsCartService, outletService, PassViewService) {

	$scope.viewOrder = PassViewService.getOrderID();
	
	//Fetch all the related passes against this order
	  $ionicLoading.show({
		template:  '<ion-spinner></ion-spinner>'
	  });

	  var data = {};
	  data.token = JSON.parse(window.localStorage.user).token;
	  data.uid = $scope.viewOrder;
	  $http({
		method  : 'POST',
		url     : 'https://www.zaitoon.online/services/fetchpasses.php',
		data    : data,
		headers : {'Content-Type': 'application/x-www-form-urlencoded'},
		timeout : 10000
	   })
	  .success(function(data) {
		$ionicLoading.hide();
		if(data.status){
				$scope.products = data.response;
				
		}	
		else{
		  $ionicLoading.hide();
		  $ionicLoading.show({
			template:  "Error: "+ data.error,
			duration: 3000
		  });			
		  $state.go('main.app.passes');
		}
	  
	   })
	  .error(function(data){
		  $ionicLoading.hide();
		  $ionicLoading.show({
			template:  "Not responding. Check your connection.",
			duration: 3000
		  });
	  });

  
	$scope.viewthis = function(cont){
          var alertPopup = $ionicPopup.alert({
          cssClass: 'popup-outer new-shipping-address-view',
          title: 'Unique Pass ID',
          template: "<div style='padding: 15px 5px; text-align: center; letter-spacing: 4px;'><strong style='color: #2ecc71; font-size: 21px'>"+cont+"</strong></div>"
          });		
	}

	$scope.close = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  	};
	
	
	$scope.getItemStyle = function(deal){
		
		var style = {
				"margin-bottom": "15px", 
				"padding": "4px 2px",
				"background": "#303335", 
				"color": "#fff",
				"border": "2px dashed #4b4f52",
				"border-radius":" 10px",
				"box-shadow": "0 0 0 4px #303335, 2px 1px 4px 3px rgba(10, 10, 0, 0.3)"
		}

			
		if(deal.isImageAvailable == 1){
			style = {
				"margin-bottom": "15px", 
				"background": "#303335", 
				"color": "#fff",
				"border": "none",
				"padding" : "0",
				"border-radius":" 10px",
				"box-shadow": "0 0 0 4px #303335, 2px 1px 4px 3px rgba(10, 10, 0, 0.3)"
			}			
		}
		return style;
	}	

})





;
