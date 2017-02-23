angular.module('zaitoonFirst.checkout.controllers', [])

.controller('CheckoutCtrl', function($scope, $state, $rootScope, products, CheckoutService, $ionicPopover) {

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
	var tax = 0.07;

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

	$scope.cancel = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  };

	$scope.getSelectedAddress = function() {
		return CheckoutService.getUserSelectedAddress().street;
	};

	$scope.getSelectedCard = function() {
		return CheckoutService.getUserSelectedCard().number;
	};

})

.controller('CheckoutAddressCtrl', function($scope, $state, $rootScope, $ionicPopover, user_shipping_addresses, $ionicLoading, $ionicPopup, CheckoutService) {
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
		console.log("opening addresses popover");
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
            // return $scope.data;
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

    var editAddressPopup = $ionicPopup.show({
      cssClass: 'popup-outer edit-shipping-address-view',
      templateUrl: 'views/checkout/partials/edit-shipping-address-popup.html',
      title: address.street,
      scope: $scope,
      buttons: [
        { text: 'Close' },
        {
          text: 'Delete',
					// type: 'icon-left ion-trash-a delete-button',
					type: 'delete-button',
          onTap: function(e) {
            // return $scope.data;
          }
        },
        {
          text: 'Edit',
          onTap: function(e) {
            // return $scope.data;
          }
        }
      ]
    });
    editAddressPopup.then(function(res) {
      if(res)
      {
				console.log('hacer algo cuando apreta ADD con los datos llenos')
      }
      else {}
    });
  };
})

.controller('CheckoutCardCtrl', function($scope, $state, $rootScope, $ionicPopover, user_credit_cards, $ionicLoading, $ionicPopup, CheckoutService) {

	$ionicPopover.fromTemplateUrl('views/checkout/partials/card-chooser-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.cards_popover = popover;
  });

	$scope.cancel = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  };

	$scope.user_credit_cards = user_credit_cards;
	$scope.data = {};
	$scope.data.selected_card = {};
	$scope.show_new_card_button = true;

	$scope.selectCreditCard = function(card){
		$scope.cards_popover.hide();
	};

	$scope.saveSelectedCreditCard = function(card){
		CheckoutService.saveUserSelectedCard(card);
		$scope.cancel();
	};

	$scope.openCardsPopover = function($event){
		console.log("opening cards popover");
		$scope.cards_popover.show($event);
	};

	$scope.deleteCreditCard = function(card){
		//do something and then close popup
	}

	$scope.addCreditCard = function(card){
			//do something and then close popup
	}

	$scope.editCreditCard = function(card){
			//do something and then close popup
	}

  $scope.showNewCardPopup = function() {
    var newCardPopup = $ionicPopup.show({
      cssClass: 'popup-outer new-card-view',
      templateUrl: 'views/checkout/partials/new-card-popup.html',
      title: 'New Card',
      scope: $scope,
      buttons: [
        { text: 'Close' },
        {
          text: 'Add',
          onTap: function(e) {
            // return $scope.data;
          }
        }
      ]
    });
    newCardPopup.then(function(res) {
      if(res)
      {
				console.log('hacer algo cuando apreta ADD con los datos llenos')
      }
      else {}
    });
  };

  $scope.showEditCardPopup = function(card) {
		$scope.card = card;

    var editCardPopup = $ionicPopup.show({
      cssClass: 'popup-outer edit-card-view',
      templateUrl: 'views/checkout/partials/edit-card-popup.html',
      title: '**** ' + card.number.slice(-4),
      scope: $scope,
      buttons: [
        { text: 'Close' },
				{
          text: 'Delete',
					// type: 'icon-left ion-trash-a delete-button',
					type: 'delete-button',
          onTap: function(e) {
            // return $scope.data;
          }
        },
        {
          text: 'Edit',
          onTap: function(e) {
            // return $scope.data;
          }
        }
      ]
    });
    editCardPopup.then(function(res) {
      if(res)
      {
				console.log('hacer algo cuando apreta ADD con los datos llenos')
      }
      else {}
    });
  };
})

.controller('CheckoutPromoCodeCtrl', function($scope) {

})


.controller('trackCtrl', function($scope) {

  $scope.status = 3;

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
