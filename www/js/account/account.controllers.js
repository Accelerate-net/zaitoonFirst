angular.module('zaitoonFirst.account.controllers', [])

.controller('RewardsCtrl', function(ConnectivityMonitor, $scope, $http, $state, $ionicLoading) {
console.log('PROFILE................')
  //Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

  //If not logged in
  if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
    $state.go('main.app.rewardslanding');
  }



$ionicLoading.show({
  template:  '<ion-spinner></ion-spinner>'
});

var data = {};
data.token = JSON.parse(window.localStorage.user).token;
$http({
  method  : 'POST',
  url     : 'https://www.zaitoon.online/services/getloyaltystatus.php',
  data    : data,
  headers : {'Content-Type': 'application/x-www-form-urlencoded'},
  timeout : 10000
 })
.success(function(data) {
  console.log(data)
  $ionicLoading.hide();
  if(data.error == "NOTENROLLED"){
    $state.go('main.app.rewardslanding');
  }
  if(data.status){
    $scope.rewardsInfo = data.response;
  }
  else{
    $scope.errorMsg = data.error;
  }

})
.error(function(data){
    $ionicLoading.hide();
    $ionicLoading.show({
      template:  "Not responding. Check your connection.",
      duration: 3000
    });
});



//Loyalty History
$ionicLoading.show({
  template:  '<ion-spinner></ion-spinner>'
});

$scope.isEmpty = false;

var data = {};
data.token = JSON.parse(window.localStorage.user).token;
data.id = 0;
$http({
  method  : 'POST',
  url     : 'https://www.zaitoon.online/services/loyaltyhistory.php',
  data    : data,
  headers : {'Content-Type': 'application/x-www-form-urlencoded'},
  timeout : 10000
 })
.success(function(data) {

  $ionicLoading.hide();

  if(data.status){
    $scope.historyList = data.response;
    if($scope.historyList.length == 0)
      $scope.isEmpty = true;
    else
      $scope.isEmpty = false;
    $scope.left = 1;
  }
  else{
  }


})
.error(function(data){
    $ionicLoading.hide();
    $ionicLoading.show({
      template:  "Not responding. Check your connection.",
      duration: 3000
    });
});


$scope.limiter = 5;
$scope.loadMore = function() {
  var data = {};
  data.token = JSON.parse(window.localStorage.user).token;
  data.id = $scope.limiter;

  $http({
    method  : 'POST',
    url     : 'https://www.zaitoon.online/services/loyaltyhistory.php',
    data    : data,
    headers : {'Content-Type': 'application/x-www-form-urlencoded'},
    timeout : 10000
   })
  .success(function(data) {

    if(data.response.length == 0){
      $scope.left = 0;
    }
    $scope.historyList = $scope.historyList.concat(data.response)

    $scope.limiter+=5;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  })
  .error(function(data){
      $ionicLoading.hide();
      $ionicLoading.show({
        template:  "Not responding. Check your connection.",
        duration: 3000
      });
  });

};


})

.controller('RewardsLandingCtrl', function(ConnectivityMonitor, $scope, $http, $state, $ionicLoading) {

  console.log('LANDING................')

  //Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

  //Logged in or not
  $scope.isEnrolledFlag = false;
  if(!_.isUndefined(window.localStorage.user)){
    $scope.isEnrolledFlag = JSON.parse(window.localStorage.user).isRewardEnabled;
  }
  else{
    $scope.isEnrolledFlag = false;
  }


  //Enroll for Rewards
  $scope.enrollNow = function(){
    //if not logged in
    if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
      $ionicLoading.show({
        template:  'Please login to enroll',
        duration: 3000
      });
      $state.go('intro.auth-login');
    }
    else{

      $ionicLoading.show({
        template:  '<ion-spinner></ion-spinner>'
      });

      var data = {};
      data.token = JSON.parse(window.localStorage.user).token;
      $http({
        method  : 'POST',
        url     : 'https://www.zaitoon.online/services/enrollloyaltyprogram.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'},
        timeout : 10000
       })
      .success(function(data) {
        console.log(data)
        $ionicLoading.hide();
        if(data.status){
          var temp_user = JSON.parse(window.localStorage.user);
  				temp_user.isRewardEnabled = true;
  				window.localStorage.user = JSON.stringify(temp_user);
          $state.go('main.app.rewards');
        }
        else{
          $ionicLoading.show({
            template:  data.error,
            duration: 3000
          });
        }
      })
      .error(function(data){
          $ionicLoading.hide();
          $ionicLoading.show({
            template:  "Not responding. Check your connection.",
            duration: 3000
          });
      });
    }
  }


  $http.get('https://www.zaitoon.online/services/getloyaltyscheme.php')
  .then(function(response){
    $scope.schemesList = response.data;
  });


})

.controller('ProfileCtrl', function(ConnectivityMonitor, $scope, $rootScope, $http, user, ProfileService, $ionicPopover, $ionicPopup, $ionicActionSheet, $state) {

  //Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
    $scope.customer = JSON.parse(window.localStorage.user); //display offline content
	}
	else{
		$scope.isOfflineFlag = false;
    $scope.customer = user; //Fetch user info if online
	}



  //if not logged in
  if(_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
    $state.go('intro.auth-login');
  }

  //Settings
  $scope.show_new_address_button = false;   //Don't give a provision to add new address here.

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

    document.getElementById("inputProfileName").style.borderBottom="1px solid rgba(238, 242, 245, 1)";
    document.getElementById("inputProfileEmail").style.borderBottom="1px solid rgba(238, 242, 245, 1)";

    $scope.isEditMode = false;
  }

  $scope.saveEdit = function(){
    $scope.isEditMode = false;
    document.getElementById("inputProfileName").style.borderBottom="1px solid rgba(238, 242, 245, 1)";
    document.getElementById("inputProfileEmail").style.borderBottom="1px solid rgba(238, 242, 245, 1)";

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


	$scope.logout = function() {
		$ionicActionSheet.show({
			buttons: [
        { text: '<i class="icon ion-log-out assertive"></i> <i class="assertive">Logout</i>' },
        { text: '<i class="icon"></i> <i class="dark">Cancel</i>' },
      ],
			titleText: 'Are you sure you want to logout?',
			buttonClicked: function(index) {
				if(index == 0){
					window.localStorage.clear();
					$state.go('intro.auth-login');
				}
        return true;
      },
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

.controller('OrdersCtrl', function(ConnectivityMonitor, $scope, $http, trackOrderService, $state) {



    //Network Status
  	if(ConnectivityMonitor.isOffline()){
  		$scope.isOfflineFlag = true;
  	}
  	else{
  		$scope.isOfflineFlag = false;
  	}


  $scope.trackMe = function(id){
    trackOrderService.setOrderID(id);
    $state.go('main.app.checkout.track');
  }


  var data = {};
  data.token = JSON.parse(window.localStorage.user).token;
  data.id = 0;

  $http({
    method  : 'POST',
    url     : 'https://www.zaitoon.online/services/orderhistory.php',
    data    : data,
    headers : {'Content-Type': 'application/x-www-form-urlencoded'},
    timeout : 10000
   })
  .success(function(data) {

    $scope.orders = data.response;
    $scope.isFail= !data.status;
    $scope.failMsg= data.error;

    if($scope.orders.length == 0)
      $scope.isEmpty = true;
    else
      $scope.isEmpty = false;

    $scope.left = 1;
  })
  .error(function(data){
      $ionicLoading.hide();
      $ionicLoading.show({
        template:  "Not responding. Check your connection.",
        duration: 3000
      });
  });


  $scope.limiter = 5;
  $scope.loadMore = function() {
    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;
    data.id = $scope.limiter;

    $http({
      method  : 'POST',
      url     : 'https://www.zaitoon.online/services/orderhistory.php',
      data    : data,
      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      timeout : 10000
     })
    .success(function(items) {

      if(items.response.length == 0){
        $scope.left = 0;
      }
      $scope.orders = $scope.orders.concat(items.response)

    //  $scope.feedsList.push(items);
      $scope.limiter+=5;

      //$scope.left = 0;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    })
    .error(function(data){
        $ionicLoading.show({
          template:  "Not responding. Check your connection.",
          duration: 3000
        });
    });

  };




  //
  // $http.get('https://www.zaitoon.online/services/orderhistory.php?id=0&token='+token)
  // .then(function(response){
  //       $scope.orders = response.data.response;
  //       if($scope.orders.length == 0)
  //         $scope.isEmpty = true;
  //       else
  //         $scope.isEmpty = false;
  //
  //       $scope.left = 1;
  //   });
  // $scope.limiter=5;
  // $scope.loadMore = function() {
  //   $http.get('https://www.zaitoon.online/services/orderhistory.php?id='+$scope.limiter+'&token='+token)
  //   .then(function(items) {
  //     if(items.data.response.length == 0){
  //       $scope.left = 0;
  //     }
  //     $scope.orders = $scope.orders.concat(items.data.response)
  //
  //   //  $scope.feedsList.push(items);
  //     $scope.limiter+=5;
  //
  //     //$scope.left = 0;
  //     $scope.$broadcast('scroll.infiniteScrollComplete');
  //   });
  // };

})


;
