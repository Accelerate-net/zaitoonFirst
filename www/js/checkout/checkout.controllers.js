angular.module('zaitoonFirst.checkout.controllers', [])

.controller('CheckoutCtrl', function($timeout, ConnectivityMonitor, trackOrderService, $scope, $state, $http, ProfileService, $rootScope, products, CheckoutService, couponService, outletService, $ionicPopover, $ionicPlatform, $ionicLoading) {

  //If not logged in (meaning, does not have a token)?
  if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
    $ionicLoading.show({
      template:  'Please login to place an order',
      duration: 3000
    });
    $state.go('intro.auth-login');
  }

 //User Info
 $rootScope.user = "";
 ProfileService.getUserData()
 .then(function(response){
   $rootScope.user = response;
 })


  //Network Status
  if(ConnectivityMonitor.isOffline()){
    $scope.isOfflineFlag = true;
    $ionicLoading.show({
      template:  'Please connect to Internet',
      duration: 3000
    });
  }
  else{
    $scope.isOfflineFlag = false;
  }



  //OUTLET INFO
	$scope.outletSelection = outletService.getInfo();
	$scope.deliveryCharge = Math.ceil($scope.outletSelection['parcelPercentageDelivery']*100);
	$scope.pickupCharge = Math.ceil($scope.outletSelection['parcelPercentagePickup']*100);
	$scope.taxPercentage = Math.ceil($scope.outletSelection['taxPercentage']*100);

  $scope.razorpayKey = $scope.outletSelection['paymentKey'];

  if(!$scope.outletSelection['outlet']){
    $state.go('intro.walkthrough-welcome');
  }

  //Pickup Defaulting for IIT Madras and Special Outlets
  $scope.isPickupChangeable = true;
  if($scope.outletSelection['isSpecial']){
    $scope.isPickupChangeable = false;
    $http.get('http://www.zaitoon.online/services/fetchoutletinfosimple.php?outlet='+$scope.outletSelection['outlet'])
    .then(function(response){
      $scope.myOutletFixed = response.data.response;
      $scope.pickupAddressDefault = $scope.myOutletFixed[0].name;
    });
  }


  //Change location
  $scope.changeLocation = function(){
    window.localStorage.changeLocationFlag = true;
    window.localStorage.backFlag = true;
    $state.go('intro.walkthrough-welcome');
  }


  //Get the checkout mode TAKEAWAY/DELIVERY
  $scope.checkoutMode = CheckoutService.getCheckoutMode();

  $scope.comments = {};
  $scope.comments.value = "";


  //Set of Outlets Available

  $http.get('http://www.zaitoon.online/services/fetchoutletssimple.php?city='+$scope.outletSelection.city)
  .then(function(response){
    $scope.outletList = response.data.response;

    //For UI enhancement in popup
    $scope.outletListSize = Object.keys($scope.outletList).length;

    //Set what to display for the default pickup outlet
    var default_outlet = $scope.outletSelection.outlet;
    var i = 0;
    while (i < Object.keys($scope.outletList).length){
      if($scope.outletList[i].value == default_outlet){
        window.localStorage.outletInfo = $scope.outletList[i].name;
        break;
      }
      i++;
    }
  });


    var temp_nearest = {};
    $timeout(function () { //Time delay is added to give time gap for loading location
      //Nearest Oulet
      temp_nearest.value = $scope.outletSelection.outlet;
      temp_nearest.name = window.localStorage.outletInfo;
    }, 500);

    //To choose the pick up center
    $scope.data = {};
    $scope.data.selected_outlet = temp_nearest;

    console.log('&&&&&&&&&')
    console.log($scope.data.selected_outlet)


  //Choose Outlet
  $timeout(function () { //Time delay is added to give time gap for popup to load!!
    $ionicPopover.fromTemplateUrl('views/checkout/partials/pickup-outlet-chooser-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.outlet_popover = popover;
    });
  }, 1000);

  $scope.openOutletPopover = function($event){
    $scope.outlet_popover.show($event);
  };

  $scope.setOutlet = function(outletObj){
    console.log(outletObj.value)
    window.localStorage.outlet = outletObj.value;
    $scope.data.selected_outlet = outletObj;
    $scope.outlet_popover.hide();

    //Update Payment Info.
    $scope.onlinePayFlag = outletObj.isAcceptingOnlinePayment;
    $scope.razorpayKey = outletObj.razorpayID
  };

	$scope.products = products;

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

  	$scope.getParcel = function() {
  		if($scope.checkoutMode == 'delivery'){
  			$scope.parcel = $scope.subtotal * $scope.outletSelection['parcelPercentageDelivery'];
  		}
  		else{
  			$scope.parcel = $scope.subtotal * $scope.outletSelection['parcelPercentagePickup'];
  		}
  		return Math.ceil($scope.parcel);
  	};

  	$scope.getTotal = function() {
  		return $scope.subtotal + Math.ceil($scope.tax) + Math.ceil($scope.parcel);
  	};

	$scope.cancel = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams);
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
      data.coupon = promo;
      data.token = JSON.parse(window.localStorage.user).token;

      //Formatting Cart Object in the service required way
      var formattedcart = {};
      formattedcart.cartTotal = this.getSubtotal();
      formattedcart.cartCoupon = promo;
      formattedcart.items = JSON.parse(window.localStorage.zaitoonFirst_cart);
      data.cart = formattedcart;
      $http({
        method  : 'POST',
        url     : 'http://www.zaitoon.online/services/validatecoupon.php',
        data    : data,
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
  $scope.onlinePayFlag = false;
	$scope.onlinePayFlag = $scope.outletSelection['isAcceptingOnlinePayment'];
	if($scope.onlinePayFlag)
		$scope.paychoice = 'PRE';
	else
		$scope.paychoice = 'COD';

  $scope.setPay = function (value) {
    $scope.paychoice = value;
  }


console.log('%%%%%% '+$scope.outletSelection['paymentKey'])


	//RAZORPAY INTEGRATION
  var called = false

  var successCallback = function(payment_id) {
    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;
    data.orderID = $scope.orderID;
    data.transactionID = payment_id;

    $http({
      method  : 'POST',
      url     : 'http://www.zaitoon.online/services/processpayment.php',
      data    : data,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(response) {
      if(response.data.status){
        //Go to track page
        trackOrderService.setOrderID(response.data.orderid);
        $state.go('main.app.checkout.track');
      }
      else{
        $ionicLoading.show({
          template:  'Something went wrong. The order was not placed.',
          duration: 3000
        });
      }
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

  $ionicPlatform.ready(function(){
    $scope.placeOrder = function() {

      if($scope.isOfflineFlag){
        $ionicLoading.show({
          template:  'Please connect to Internet',
          duration: 2000
        });
      }
      //If PREPAID
      if($scope.paychoice == 'PRE'){
        if (!called) {

          //Step 1 - Create ORDER
          //Create Order
          var data = {};
          data.token = JSON.parse(window.localStorage.user).token;
          data.comments = $scope.comments.value;
          data.address = !_.isUndefined(window.localStorage.zaitoonFirst_selected_address)? JSON.parse(window.localStorage.zaitoonFirst_selected_address): [];
          data.modeOfPayment = $scope.paychoice;
          data.outlet = window.localStorage.outlet;
          data.isTakeAway = $scope.checkoutMode =='takeaway'? true: false;

          var formattedcart = {};
          formattedcart.cartTotal = this.getSubtotal();
          formattedcart.cartExtra = this.getTax() + this.getParcel();
          formattedcart.cartDiscount = $scope.couponDiscount;
          formattedcart.cartCoupon = couponService.getCoupon();
          formattedcart.items = JSON.parse(window.localStorage.zaitoonFirst_cart);
          data.cart = formattedcart;
          data.platform = "MOB";
          data.location = $scope.outletSelection['locationCode'];


          $http({
            method  : 'POST',
            url     : 'http://www.zaitoon.online/services/createorder.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
          .then(function(response) {
            if(!response.data.status){
              $ionicLoading.show({
                template:  '<b style="color: #e74c3c; font-size: 150%">Error!</b><br>'+response.data.error,
                duration: 3000
              });
            }
            else{
              if(response.data.isPrepaidAllowed){
                $scope.orderID = response.data.orderid;
                //Payment options
                var options = {
                  description: 'Payment for Order #'+response.data.orderid,
                  image: 'https://zaitoon.online/services/images/razor_icon.png',
                  currency: 'INR',
                  key: $scope.razorpayKey,
                  amount: response.data.amount*100,
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
          });


        }
      }
      else{ //Cash on Delivery
        //Create Order
        var data = {};
        data.token = JSON.parse(window.localStorage.user).token;
        data.address = !_.isUndefined(window.localStorage.zaitoonFirst_selected_address)? JSON.parse(window.localStorage.zaitoonFirst_selected_address): [];
        data.comments = $scope.comments.value;
        data.modeOfPayment = $scope.paychoice;
        data.outlet = window.localStorage.outlet;
        data.isTakeAway = $scope.checkoutMode =='takeaway'? true: false;

        var formattedcart = {};
        formattedcart.cartTotal = this.getSubtotal();
        formattedcart.cartExtra = this.getTax() + this.getParcel();
        formattedcart.cartDiscount = $scope.couponDiscount;
        formattedcart.cartCoupon = couponService.getCoupon();
        formattedcart.items = JSON.parse(window.localStorage.zaitoonFirst_cart);
        data.cart = formattedcart;
        data.platform = "MOB";
        data.location = $scope.outletSelection['locationCode'];

        $http({
          method  : 'POST',
          url     : 'http://www.zaitoon.online/services/createorder.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
          if(!response.data.status){
            $ionicLoading.show({
              template:  '<b style="color: #e74c3c; font-size: 150%">Error!</b><br>'+response.data.error,
              duration: 3000
            });
          }
          else{
            //Go to track page
            trackOrderService.setOrderID(response.data.orderid);
            $state.go('main.app.checkout.track');
          }
        });

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
							url     : 'http://www.zaitoon.online/services/newaddress.php',
							data    : data,
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
							url     : 'http://www.zaitoon.online/services/editaddress.php',
							data    : data,
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

.controller('trackCtrl', function($scope, $state, $interval, $http, $ionicLoading, trackOrderService) {

  //If not logged in (meaning, does not have a token)?
  if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
    $ionicLoading.show({
      template:  'Please login to view this page',
      duration: 3000
    });
    $state.go('intro.auth-login');
  }

  var data = {};

  data.token = JSON.parse(window.localStorage.user).token;
  data.orderID = trackOrderService.getOrderID();

  $http({
    method  : 'POST',
    url     : 'http://www.zaitoon.online/services/orderinfo.php',
    data    : data,
    headers : {'Content-Type': 'application/x-www-form-urlencoded'}
   })
  .then(function(response) {
    $scope.track = response.data;
    $scope.status = $scope.track.response.status;
    $scope.isTakeAway = $scope.track.response.isTakeaway;
  });

  //Repeated Pooling of Track Page
  $interval(function () {
    $http({
      method  : 'POST',
      url     : 'http://www.zaitoon.online/services/orderinfo.php',
      data    : data,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(response) {
      $scope.track = response.data;
      $scope.status = $scope.track.response.status;
      $scope.isTakeAway = $scope.track.response.isTakeaway;
    });
  }, 15000);



})


.controller('paymentCtrl', function($scope, $interval, $http) {

  $scope.postPayment = false;
  $scope.paymentMode = "DCARD";
  $scope.status = 1;

  $scope.pollCount = 1;

  //Polling to check if payment is done.
  var pollerFunction = $interval(function () {
    console.log('------------ POLLING ...'+$scope.pollCount);
      $http.get('http://www.zaitoon.online/services/paymentconfirmation.php')
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

.controller('feedbackCtrl', function(reviewOrderService, $scope, $http, $state, $rootScope, $ionicLoading) {

  //If not logged in (meaning, does not have a token)?
  if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
    $ionicLoading.show({
      template:  'Please login to view this page',
      duration: 3000
    });
    $state.go('intro.auth-login');
  }


  $scope.tag = "";
  $scope.selection = "";

  $scope.fillTill = function(id){
    $scope.starRating = id;
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

  $scope.commentsFeed = "";
  //Characters Left in the comments
  document.getElementById('commentsBox').onkeyup = function(){
    document.getElementById('characterCount').innerHTML =   (150-(this.value.length))+ ' characters left.';
  }


  //Negative Feedback
  $rootScope.negative_feedback = {};
  $rootScope.negative_feedback.quality = false;
  $rootScope.negative_feedback.service = false;
  $rootScope.negative_feedback.delivery = false;
  $rootScope.negative_feedback.food = false;
  $rootScope.negative_feedback.app = false;
  $rootScope.negative_feedback.other = false;

  //Positive Feedback
  $rootScope.positive_feedback = {};
  $rootScope.positive_feedback.quality = false;
  $rootScope.positive_feedback.service = false;
  $rootScope.positive_feedback.delivery = false;
  $rootScope.positive_feedback.food = false;
  $rootScope.positive_feedback.app = false;
  $rootScope.positive_feedback.other = false;

  $scope.submitFeedback = function (comments){
    if(!$scope.starRating){
      $ionicLoading.show({
        template:  'Please rate us to continue!',
        duration: 2000
      });
    }
    else{
      if($scope.starRating == 5){
        var reviewObject = {
          "rating" : $scope.starRating,
          "quality" : $rootScope.positive_feedback.quality,
          "service" : $rootScope.positive_feedback.service,
          "delivery" : $rootScope.positive_feedback.delivery,
          "food" : $rootScope.positive_feedback.food,
          "app" : $rootScope.positive_feedback.app,
          "other" : $rootScope.positive_feedback.other,
          "comment" : comments
        }
      }
      else{
        var reviewObject = {
          "rating" : $scope.starRating,
          "quality" : $rootScope.negative_feedback.quality,
          "service" : $rootScope.negative_feedback.service,
          "delivery" : $rootScope.negative_feedback.delivery,
          "food" : $rootScope.negative_feedback.food,
          "app" : $rootScope.negative_feedback.app,
          "other" : $rootScope.negative_feedback.other,
          "comment" : comments
        }
      }

      $ionicLoading.show({
        template:  '<ion-spinner></ion-spinner>'
      });

      //POST review
      var data = {};
      data.token = JSON.parse(window.localStorage.user).token;
      data.orderID = reviewOrderService.getLatest();
      data.review = reviewObject;

      $http({
        method  : 'POST',
        url     : 'http://www.zaitoon.online/services/postreview.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
      .then(function(response) {
        $ionicLoading.hide();
        $state.go('main.app.feed.arabian');
      });

    }
  };

})


;
