angular.module('zaitoonFirst.walkthrough.controllers', [])

.controller('welcomeCtrl', function($scope, $state, $ionicPopover) {

	//If already logged in?
	if(!_.isUndefined(window.localStorage.user)){
		$scope.isLoggedIn = true;

		$scope.loggedUser = JSON.parse(window.localStorage.user).name;
	}
	else{
		$scope.isLoggedIn = false;
	}


	var outlet = !_.isUndefined(window.localStorage.outlet) ? window.localStorage.outlet : "";

	if(outlet == "")
		$scope.isLocationSet = false;
	else
		$scope.isLocationSet = true;

	//Avaialble Cities
	$scope.cities = [];
	$scope.cities.push({name:"Chennai"});
	$scope.cities.push({name:"Bangalore"});
	$scope.cities.push({name:"Madurai"});
	console.log($scope.cities);

	//Default Selection
		$scope.data = {};
  	$scope.data.selected_city = $scope.cities[0];
  	console.log($scope.cities[0]);

	  //Choose City
	  $ionicPopover.fromTemplateUrl('views/checkout/partials/outlet-chooser-popover.html', {
	    scope: $scope
	  }).then(function(popover) {
	    $scope.city_popover = popover;
	  });

	$scope.openCityPopover = function($event){
		$scope.city_popover.show($event);
	};

	$scope.setCity = function(city){
		var temp = {name:city};
		$scope.data.selected_city = temp;
		$scope.city_popover.hide();
	};


	//Choose Locality Search
	$scope.search = { query : '' };
	var cs = [];
	cs.push({name:"IIT Madras"});
	cs.push({name:"Velacheri"});
	cs.push({name:"Adyar"});
	cs.push({name:"Nungambakkam"});
	cs.push({name:"Teynampet"});
	cs.push({name:"Guindy"});
	cs.push({name:"Tiruvanmyur"});
	cs.push({name:"Royapettah"});
	cs.push({name:"Thoraippakkam"});
	$scope.localities = cs;


	  //Choose Locality
	  $ionicPopover.fromTemplateUrl('views/checkout/partials/location-chooser-popover.html', {
	    scope: $scope
	  }).then(function(popover) {
	    $scope.locality_popover = popover;
	  });

 	$scope.openLocalityPopover = function($event){
		$scope.locality_popover.show($event);
	};

	$scope.setLocality = function(locality){

		if(window.localStorage.backFlag){
			window.localStorage.backFlag = [];
			window.localStorage.outlet = "VELACHERY";
			$state.go('main.app.checkout');
		}

		$scope.isLocationSet = true;
		var temp = {name:locality};
		$scope.data.selected_locality = temp;
		$scope.locality_popover.hide();

		// What's pending?
		//1. When user makes selection of City, populate locality list based on that.
		//2. When User selects a locality, assign the nearest OUTLET. Now hardcoded to "VELACHERY"

		window.localStorage.outlet = "VELACHERY";

	};

})

;
