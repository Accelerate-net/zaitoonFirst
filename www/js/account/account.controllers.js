angular.module('zaitoonFirst.account.controllers', [])

.controller('ProfileCtrl', function($scope, $http, user, $ionicPopover, $ionicPopup, $ionicActionSheet, $state) {
  
  //Edit Profile
  $scope.isEditMode = false;

  $scope.editProfile = function(){
    //Take back up of current values
    $scope.temp_name = $scope.user.name;
    $scope.temp_email = $scope.user.email;

    $scope.isEditMode = true;
  }

  $scope.cancelEdit = function(){
    //Reset revious values
    $scope.user.name = $scope.temp_name;
    $scope.user.email = $scope.temp_email;

    $scope.isEditMode = false;
  }

  $scope.saveEdit = function(){
    $scope.isEditMode = false;
    //Call http request and make the changes in the servers
  }  

  $scope.user = user;

  $scope.user.mobile ="9043960876";
  $scope.user.membersince = "7th January 2017";

  $scope.user_credit_cards = user.credit_cards;
  $scope.user_shipping_addresses = user.shipping_addresses;
  console.log(user.shipping_addresses);
  $scope.data = {};
  $scope.data.selected_card = user.credit_cards[0];
	$scope.data.selected_address = user.shipping_addresses[0];

  $scope.user.name = user.first_name;
  $scope.user.password = 'pepe123456789';
  $scope.show_new_address_button = false;
  $scope.show_new_card_button = false;
  $scope.notifications = {};
  $scope.notifications.promotions = false;
  $scope.notifications.shipment_updates = true;

  $ionicPopover.fromTemplateUrl('views/checkout/partials/address-chooser-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.addresses_popover = popover;
  });

  $scope.openAddressesPopover = function($event){
		$scope.addresses_popover.show($event);
	};
  $scope.selectShippingAddress = function(address){
		$scope.addresses_popover.hide();
	};


  $scope.logout = function(){
    $ionicActionSheet.show({
      titleText: 'Are you sure you want to logout?',
      destructiveText: 'Logout',
      cancelText: 'Cancel',
      cancel: function() {
        return true;
      },
      destructiveButtonClicked: function() {
        $state.go('intro.auth-login');
      }
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
          text: 'Save',
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

.controller('OrdersCtrl', function($scope, orders, OrderService,$http) {

  $http.get('http://localhost/vega-web-app/online/orderhistory.php?id=0')
  .then(function(response){
        console.log('********* am here');
        console.log(response.data);
        $scope.orders = response.data;
        console.log($scope.menu);
        $scope.left = 1;
    });
  $scope.limiter=5;
  $scope.loadMore = function() {
    $http.get('http://localhost/vega-web-app/online/orderhistory.php?id='+$scope.limiter).then(function(items) {
      if(items.data.length == 0){
        $scope.left = 0;
      }
      $scope.orders = $scope.orders.concat(items.data)

    //  $scope.feedsList.push(items);
      $scope.limiter+=5;

      //$scope.left = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})


;
