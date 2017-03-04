angular.module('zaitoonFirst.walkthrough.controllers', [])

.controller('welcomeCtrl', function($timeout, outletService, $scope, $http, $rootScope, $state, $ionicPopover, $ionicLoading) {

	//If already logged in?
	if(!_.isUndefined(window.localStorage.user)){
		$scope.isLoggedIn = true;
		$scope.loggedUser = JSON.parse(window.localStorage.user).name;
	}
	else{
		$scope.isLoggedIn = false;
	}

	//Network Status
	// if(ConnectivityMonitor.isOffline()){
	// 	$scope.isOfflineFlag = true;
	// }
	// else{
	// 	$scope.isOfflineFlag = false;
	// }


	$scope.logout = function() {
		window.localStorage.clear();
		$state.go('intro.auth-login');
	};

	var outlet = !_.isUndefined(window.localStorage.outlet) ? window.localStorage.outlet : "";
	var locationCode = !_.isUndefined(window.localStorage.locationCode) ? window.localStorage.locationCode : "";

	if(outlet == "")
		$scope.isLocationSet = false;
	else
		$scope.isLocationSet = true;

	if(locationCode == "")
		$scope.isLocationSet = false;
	else
		$scope.isLocationSet = true;

	//Avaialble Cities
	$scope.data = {};
	$http.get('http://www.zaitoon.online/services/fetchcities.php')
	.then(function(response){
		$scope.cities = response.data.response;
	});

	  //Choose City
		$timeout(function () { //Time delay is added to give time gap for popup to load!!
		  $ionicPopover.fromTemplateUrl('views/checkout/partials/outlet-chooser-popover.html', {
		    scope: $scope
		  }).then(function(popover) {
		    $scope.city_popover = popover;
		  });
		}, 1000);

	$scope.openCityPopover = function($event){
		if($scope.isOfflineFlag){
			$ionicLoading.show({
				template:  'Please connect to Internet.',
				duration: 3000
			});
		}else{
			$scope.city_popover.show($event);
		}

	};

	$scope.setCity = function(city){
		var temp = {name:city};
		$scope.data.selected_city = temp;

		//Set CITY in Outlet service
		var info = {};
		info.city = city;
		outletService.setOutletInfo(info);
		this.updateLocations();

		$scope.city_popover.hide();
	};


	//Choose Locality Search
	$scope.updateLocations = function(){
		$scope.search = { query : '' };
		var temp_outlet = outletService.getInfo();
		$http.get('chennai.json')
		.then(function(response){
			$scope.localities = response.data.response;
			console.log(response.data.response)
		});
	}



	  //Choose Locality
		$timeout(function () { //Time delay is added to give time gap for popup to load!!
		  $ionicPopover.fromTemplateUrl('views/checkout/partials/location-chooser-popover.html', {
		    scope: $scope
		  }).then(function(popover) {
		    $scope.locality_popover = popover;
		  });
		}, 1000);

 	$scope.openLocalityPopover = function($event){
		var temp_outlet = outletService.getInfo();
		if(temp_outlet.city != ""){
			console.log(temp_outlet.city);
			$scope.locality_popover.show($event);
		}
		else{ //City not set.
			$ionicLoading.show({
	      template:  'Please choose a City first',
	      duration: 3000
	    });
		}

	};

	$rootScope.setLocality = function(locationCode, locationName){
		$http.get('http://www.zaitoon.online/services/fetchoutlets.php?locationCode='+locationCode)
		.then(function(response){
			//Set outlet and location
			window.localStorage.outlet = response.data.response.outlet;
			window.localStorage.location = response.data.response.location;
			window.localStorage.locationCode = response.data.response.locationCode;

			var info = {};
			info.outlet = response.data.response.outlet;
	    info.city = response.data.response.city;
	    info.location = response.data.response.location;
			info.locationCode = response.data.response.locationCode;
	    info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
	    info.isTaxCollected = response.data.response.isTaxCollected;
	    info.taxPercentage = response.data.response.taxPercentage;
	    info.isParcelCollected = response.data.response.isParcelCollected;
	    info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
	    info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
	    info.minAmount = response.data.response.minAmount;
	    info.minTime = response.data.response.minTime;
			outletService.setOutletInfo(info);
		});

		$scope.locality_popover.hide();

		var temp = {name:locationName};
		$scope.data.selected_locality = temp;


		//Go back to the checkout page (if it was redirected to set location)
		$timeout(function () {
			if(window.localStorage.backFlag){
				window.localStorage.backFlag = "";
				$state.go('main.app.checkout');
			}
			else if(window.localStorage.backFlagCart){
				window.localStorage.backFlagCart = "";
				$state.go('main.app.shopping-cart');
			}
			else{
				$scope.isLocationSet = true;
			}
		}, 1000);


	};

})

;
