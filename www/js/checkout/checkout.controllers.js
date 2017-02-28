angular.module('zaitoonFirst.checkout.controllers', [])

.controller('CheckoutCtrl', function($scope, $state, $http, ProfileService, $rootScope, products, CheckoutService, couponService, outletService, $ionicPopover, $ionicPlatform) {

	//User Info
 $rootScope.user = "";
 ProfileService.getUserData()
 .then(function(response){
	 $rootScope.user = response;
 })


  //OUTLET INFO
	$scope.outletSelection = outletService.getInfo();

  //Change location
  $scope.changeLocation = function(){
    window.localStorage.outlet = [];
    window.localStorage.backFlag = true;
    $state.go('intro.walkthrough-welcome');
  }


  //Get the checkout mode TAKEAWAY/DELIVERY
  $scope.checkoutMode = CheckoutService.getCheckoutMode();

  //Set of Outlets Available
  $scope.outletList = [
    {
      value:"VELACHERY",
      name:"Velachery, Opp. Grand Mall"
    },
    {
      value:"ADYAR",
      name:"Adyar, Near Bus Depot"
    },
    {
      value:"ROYAPETTAH",
      name:"Royapettah, Near EA Mall"
    }
  ];

  $scope.outletSelected = $scope.outletList[0];


  //To choose the pick up center
  $scope.data = {};
  $scope.data.selected_outlet = $scope.outletList[0];

  //Choose Outlet
  $ionicPopover.fromTemplateUrl('views/checkout/partials/pickup-outlet-chooser-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.outlet_popover = popover;
  });

  $scope.openOutletPopover = function($event){
    $scope.outlet_popover.show($event);
  };

  $scope.setOutlet = function(outletObj){
    $scope.data.selected_outlet = outletObj;
    $scope.outlet_popover.hide();
  };

	$scope.products = products;

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
  		if($scope.checkoutMode == 'delivery'){
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

	$scope.cancel = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  };

	$scope.getSelectedAddress = function() {
			return CheckoutService.getUserSelectedAddress().flatName;
	};

	$scope.getSelectedCard = function() {
		return CheckoutService.getUserSelectedCard().number;
	};

  //Validation of Coupon Code
  /*Check if coupon is already applied and locked*/
  $scope.isCouponEntered = false;

  if(couponService.getStatus()){
    $scope.isCouponApplied = true;
    $scope.couponDiscount = couponService.getDiscount();
    $scope.promoMessage = "Coupon was applied successfully.";
    $scope.promoCode = couponService.getCoupon();
  }
  else{
    $scope.isCouponApplied = false;
    $scope.promoCode = "";
    $scope.promoMessage = "";
  }

  $scope.isSuccess = true;

  $scope.enteringCoupon = function(){
    $scope.isCouponEntered = true;
  }

  $scope.validateCoupon = function(promo) {
    $scope.isCouponEntered = true;
    $scope.isCouponApplied = false;

    if(promo == "" || promo.length < 1){
      $scope.isSuccess = false;
      $scope.promoMessage = "Coupon Code can not be null.";
    }
    else{
      //Validate Coupon
      var data = {};
      data.coupon = "ZAITOONFIRST";
      $http({
        method  : 'POST',
        url     : 'http://localhost/vega-web-app/online/validatecoupon.php',
        data    : data, //forms user object
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
      .then(function(response) {
        $scope.isSuccess = response.data.status;
        if(response.data.status){
          $scope.couponDiscount = response.data.discount;

          $scope.isCouponApplied = true;
          $scope.promoMessage = "Coupon applied successfully. You are eligible for a discount of Rs. "+$scope.couponDiscount;

          //Add a lock to Cart Object.
          couponService.setStatus(true);
          couponService.setCoupon(promo);
          couponService.setDiscount($scope.couponDiscount);
        }
        else{
          $scope.promoMessage = "Failed. "+response.data.error;
        }
      });
    }

  };

	//Payment Options
	$scope.onlinePayFlag = $scope.outletSelection['isAcceptingOnlinePayment'];
	console.log($scope.onlinePayFlag)
	if($scope.onlinePayFlag)
		$scope.paychoice = 'PRE';
	else
		$scope.paychoice = 'COD';



		//RAZORPAY testing...
		var options = {
    description: '#100132',
    image: './img/common/white_logo_full.png',
    currency: 'INR',
    key: 'rzp_test_1DP5mmOlF5G5ag',
    amount: '1000',
    name: 'Zaitoon First',
    prefill: {
      email: $rootScope.user.email,
      contact: $rootScope.user.mobile,
      name: $rootScope.user.name
    },
    theme: {
      color: '#F37254'
    }
  };

  // `ng-click` is triggered twice on ionic. (See https://github.com/driftyco/ionic/issues/1022).
  // This is a dirty flag to hack around it
  var called = false

  var successCallback = function(payment_id) {
    alert('payment_id: ' + payment_id);
    called = false
  };

  var cancelCallback = function(error) {
    alert(error.description + ' (Error ' + error.code + ')');
    called = false
  };

  $ionicPlatform.ready(function(){
    $scope.placeOrder = function() {
      if (!called) {
        RazorpayCheckout.open(options, successCallback, cancelCallback);
        called = true
      }
    }
  });



	//Validate and place order
	// $scope.placeOrder = function(){
	// 	console.log('ORDER PLACED!');
	// 	$state.go('main.app.checkout.track');
	// };

})

.controller('CheckoutAddressCtrl', function($scope, $state, $http, $rootScope, $ionicPopover, ProfileService, user_shipping_addresses, $ionicLoading, $ionicPopup, CheckoutService) {
	$ionicPopover.fromTemplateUrl('views/checkout/partials/address-chooser-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.addresses_popover = popover;
  });

	$scope.cancel = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  };

	$scope.billing_same_as_shipping_address = true;
	$scope.user_shipping_addresses = user_shipping_addresses;
	$scope.data = {};
	$scope.data.selected_address = {};
	$scope.show_new_address_button = true;

	$scope.selectShippingAddress = function(address){
		$scope.addresses_popover.hide();
	};

	$scope.saveSelectedAddress = function(address){
		CheckoutService.saveUserSelectedAddress(address);
		$scope.cancel();
	};

	$scope.openAddressesPopover = function($event){
		$scope.addresses_popover.show($event);
	};

	$scope.deleteShippingAddress = function(address){
		//do something and then close popup
	};

	$scope.addShippingAddress = function(address){
			//do something and then close popup
	};

	$scope.editShippingAddress = function(address){
			//do something and then close popup
	};

  $scope.showNewAddressPopup = function() {
		$scope.address = {};
		$scope.address.name = "";
		$scope.address.flatNo="";
		$scope.address.flatName="";
		$scope.address.landmark="";
		$scope.address.area="";
		$scope.address.contact="";

		$scope.addresses_popover.hide();

    var newAddressPopup = $ionicPopup.show({
      cssClass: 'popup-outer new-shipping-address-view',
      templateUrl: 'views/checkout/partials/new-shipping-address-popup.html',
      title: 'New Address',
      scope: $scope,
      buttons: [
        { text: 'Close' },
        {
          text: 'Add',
          onTap: function(e) {

						var data = {};
						data.token = JSON.parse(window.localStorage.user).token;
						data.address = $scope.address;

						$http({
							method  : 'POST',
							url     : 'http://localhost/vega-web-app/online/newaddress.php',
							data    : data, //forms user object
							headers : {'Content-Type': 'application/x-www-form-urlencoded'}
						 })
						.then(function(response) {
							if(response.data.status)
							{
								$scope.saveSelectedAddress($scope.address);
								$state.go('main.app.checkout');
							}
							else{
								$ionicLoading.show({
									template:  '<b style="color: #e74c3c">Error!</b><br>Failed to add address. '+response.data.error,
									duration: 2000
								});
							}
						});


          }
        }
      ]
    });
    newAddressPopup.then(function(res) {
      if(res)
      {
				console.log('hacer algo cuando apreta ADD con los datos llenos')
      }
      else {}
    });
  };

  $scope.showEditAddressPopup = function(address) {
		$scope.address = address;

		$scope.addresses_popover.hide();
    var editAddressPopup = $ionicPopup.show({
      cssClass: 'popup-outer edit-shipping-address-view',
      templateUrl: 'views/checkout/partials/edit-shipping-address-popup.html',
      title: address.name,
      scope: $scope,
      buttons: [
        { text: 'Close' },
        {
          text: 'Delete',
					// type: 'icon-left ion-trash-a delete-button',
					type: 'delete-button',
          onTap: function(e) {
						var response = ProfileService.deleteSavedAddress(address.id);
						if(response){
							//Successfully deleted. Hide from current list of addresses.
							var i = 0;
							while(i < $scope.user_shipping_addresses.length){
								if(address.id == $scope.user_shipping_addresses[i].id){
									$scope.user_shipping_addresses.splice(i, 1);
									$scope.addresses_popover.hide();

									$scope.data.selected_address = "";

									if($scope.user_shipping_addresses.length == 0)
										$state.reload();

									//Set the default address
									var i = 0;
									while(i < $scope.user_shipping_addresses.length){
										if($scope.user_shipping_addresses[i].isDefault){
											$scope.data.selected_address = $scope.user_shipping_addresses[i];
											break;
										}
										i++;
									}

									break;
								}
								i++;
							}

						}
          }
        },
        {
          text: 'Save',
          onTap: function(e) {
						var data = {};
						data.token = JSON.parse(window.localStorage.user).token;
						data.address = $scope.address;
						data.id = $scope.address.id;

						$http({
							method  : 'POST',
							url     : 'http://localhost/vega-web-app/online/editaddress.php',
							data    : data, //forms user object
							headers : {'Content-Type': 'application/x-www-form-urlencoded'}
						 })
						.then(function(response) {
							if(response.data.status)
							{
								$scope.saveSelectedAddress($scope.address);
								$state.go('main.app.checkout');
							}
							else{
								$ionicLoading.show({
									template:  '<b style="color: #e74c3c">Error!</b><br>Failed to add address. '+response.data.error,
									duration: 2000
								});
							}
						});
          }
        }
      ]
    });
    editAddressPopup.then(function(res) {
      if(res){}
      else {}
    });
  };
})

.controller('trackCtrl', function($scope, $http, trackOrderService) {

  var data = {};

  //REMOVE this token/orderid hard codes
  data.token = JSON.parse(window.localStorage.user).token;
  data.orderID = trackOrderService.getOrderID();
  console.log(data.orderID);

  $http({
    method  : 'POST',
    url     : 'http://localhost/vega-web-app/online/orderinfo.php',
    data    : data, //forms user object
    headers : {'Content-Type': 'application/x-www-form-urlencoded'}
   })
  .then(function(response) {
    $scope.track = response.data;
    console.log($scope.track.response);
    $scope.status = $scope.track.response.status;
  });

})


.controller('paymentCtrl', function($scope, $interval, $http) {

  $scope.postPayment = false;
  $scope.paymentMode = "DCARD";
  $scope.status = 1;

  $scope.pollCount = 1;

  //Polling to check if payment is done.
  var pollerFunction = $interval(function () {
    console.log('------------ POLLING ...'+$scope.pollCount);
      $http.get('http://localhost/vega-web-app/online/paymentconfirmation.php')
      .then(function(response){
        $scope.response = response.data;

        if($scope.response.status){
          $scope.postPayment = true;
          document.getElementById("paymentPage").style="background-color: #ff7b4a";
          $interval.cancel(pollerFunction);
        }
      });
      $scope.pollCount++;
  }, 4000);

})

.controller('feedbackCtrl', function($scope, $rootScope) {

  $scope.tag = "";
  $scope.selection = "";

  $scope.fillTill = function(id){
    //Set a tag which matches the selection

    //Less than 5 means, a negative review.
    if(id < 5)
      $scope.selection = 'N';
    else
      $scope.selection = 'P';

    $scope.tag = "";
    switch (id){
      case 1:
      {
        $scope.tag = "Terrible";
        break;
      }
      case 2:
      {
        $scope.tag = "Bad";
        break;
      }
      case 3:
      {
        $scope.tag = "OK";
        break;
      }
      case 4:
      {
        $scope.tag = "Good";
        break;
      }
      case 5:
      {
        $scope.tag = "Awesome";
        break;
      }
    }

    var i = 1;
    while(i <= id){
      document.getElementById("star"+i).className ="icon ion-android-star";
      i++;
    }
    //Empty the remaining stars
    while(i <= 5){
      document.getElementById("star"+i).className ="icon ion-android-star-outline";
      i++;
    }
  }

  //Characters Left in the comments
  document.getElementById('commentsBox').onkeyup = function(){
    document.getElementById('characterCount').innerHTML =   (150-(this.value.length))+ ' characters left.';
  }


  //Negative Feedback
  $rootScope.negative_feedback = {};
  $rootScope.negative_feedback.packing = false;
  $rootScope.negative_feedback.service = false;
  $rootScope.negative_feedback.delivery = false;
  $rootScope.negative_feedback.food = false;
  $rootScope.negative_feedback.app = false;
  $rootScope.negative_feedback.other = false;

  //Positive Feedback
  $rootScope.positive_feedback = {};
  $rootScope.positive_feedback.quality = true;
  $rootScope.positive_feedback.service = false;
  $rootScope.positive_feedback.delivery = false;
  $rootScope.positive_feedback.food = false;
  $rootScope.positive_feedback.app = false;
  $rootScope.positive_feedback.other = false;

})


;
