angular.module('zaitoonFirst.account.controllers', [])

.controller('ProfileCtrl', function($scope, $rootScope, $http, user, ProfileService, $ionicPopover, $ionicPopup, $ionicActionSheet, $state) {
  
  //Settings
  $scope.show_new_address_button = false;   //Don't give a provision to add new address here.

  $scope.customer = user; 

  $scope.data = {};
  $scope.addressCount = 0;

  $scope.user_shipping_addresses = $scope.customer.savedAddresses;
  $scope.addressCount = $scope.customer.savedAddresses.length;


  //Set the default address
    var i = 0;
    while(i < $scope.user_shipping_addresses.length){
      if($scope.user_shipping_addresses[i].isDefault){
        $scope.data.selected_address = $scope.user_shipping_addresses[i];
        break;
      }
      i++;
    }

       

          
  //Edit Profile
  $scope.isEditMode = false;

  $scope.editProfile = function(){
    //Take back up of current values
    $scope.temp_name = $scope.customer.name;
    $scope.temp_email = $scope.customer.email;

    document.getElementById("inputProfileName").style.borderBottom="1px solid #1abc9c";
    document.getElementById("inputProfileEmail").style.borderBottom="1px solid #1abc9c";

    $scope.isEditMode = true;
  }

  $scope.cancelEdit = function(){
    //Reset revious values
    $scope.customer.name = $scope.temp_name;
    $scope.customer.email = $scope.temp_email;

    document.getElementById("inputProfileName").style.borderBottom="1px dashed #bdc3c7";
    document.getElementById("inputProfileEmail").style.borderBottom="1px dashed #bdc3c7";    

    $scope.isEditMode = false;
  }

  $scope.saveEdit = function(){
    $scope.isEditMode = false;
    document.getElementById("inputProfileName").style.borderBottom="1px dashed #bdc3c7";
    document.getElementById("inputProfileEmail").style.borderBottom="1px dashed #bdc3c7"; 

    //Call http request and make the changes in the servers
    ProfileService.updateUserData($scope.customer.name, $scope.customer.email);
  }  


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
      title: address.name,
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Delete',					
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
        $scope.orders = response.data;
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
