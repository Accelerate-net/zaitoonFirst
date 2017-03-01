angular.module('zaitoonFirst.content.controllers', [])

.controller('outletCtrl', function($scope, $http, $state, $rootScope, $ionicPopup, outlet, ShoppingCartService, $ionicLoading) {
	$scope.dateList = [];

	//Pre-populate time and date list:

	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var i = 0;
	var today = new Date();
	while(i < 7){

		var date = new Date();
		date.setDate(today.getDate() + i);

		if(i == 0){ //Today
			$scope.dateList.push({value: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),name:"Today, "+date.getDate()+' '+months[date.getMonth()]});
		}
		else if(i == 1){ //Tomorrow
			$scope.dateList.push({value: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),name:"Tomorrow, "+date.getDate()+' '+months[date.getMonth()]});
		}
		else{ //Day Name
			$scope.dateList.push({value: date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear(),name:days[date.getDay()]+", "+date.getDate()+' '+months[date.getMonth()]});
		}
		i++;
	}


	$scope.timeDefaultList = [
		{
			value:"1230",
			name:"12:30 PM"
		},
		{
			value:"1300",
			name:"01:00 PM"
		},
		{
			value:"1330",
			name:"01:30 PM"
		},
		{
			value:"1400",
			name:"02:00 PM"
		},
		{
			value:"1430",
			name:"02:30 PM"
		},
		{
			value:"1500",
			name:"03:00 PM"
		},
		{
			value:"1530",
			name:"03:30 PM"
		},
		{
			value:"1600",
			name:"04:00 PM"
		},
		{
			value:"1630",
			name:"04:30 PM"
		},
		{
			value:"1700",
			name:"05:00 PM"
		},
		{
			value:"1730",
			name:"05:30 PM"
		},
		{
			value:"1800",
			name:"06:00 PM"
		},
		{
			value:"1830",
			name:"06:30 PM"
		},
		{
			value:"1900",
			name:"07:00 PM"
		},
		{
			value:"1930",
			name:"07:30 PM"
		},
		{
			value:"2000",
			name:"08:00 PM"
		},
		{
			value:"2030",
			name:"08:30 PM"
		},
		{
			value:"2100",
			name:"09:00 PM"
		},
		{
			value:"2130",
			name:"09:30 PM"
		},
		{
			value:"2200",
			name:"10:00 PM"
		}

	];

	//Set Time List to display
	$scope.timeList = $scope.timeDefaultList;

	//Remove past time slots
	var currentTime = today.getHours();
	if(currentTime > 12){
		var startIndex = 2*(currentTime - 12);

		//Say, if it's already 9.25 pm do not show 9.30 in the time slot. Skip Index.
		if(today.getMinutes() > 25)
			startIndex++;

		if(startIndex < 20){ //If time is less 10 pm (say upto 9.59 pm)
			$scope.timeList = $scope.timeList.slice(startIndex, 21);
		}
	}


	//Remove TODAY option if it's already 10 PM in the night.
	if(today.getHours() >= 22 && today.getMinutes() > 1){
		$scope.dateList = $scope.dateList.splice(1, 6);
	}

	$scope.fetchTimeslots = function(data){
		//If the date is TODAY, and remove time slots already passed.
		var todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
		if(data.dateSelected.value != todayDate){
			$scope.timeList = $scope.timeDefaultList;
			$scope.timeSelected = $scope.timeList[0];
		}
		else
		{
			//Remove past time slots
			var currentTime = today.getHours();
			if(currentTime > 12){
				var startIndex = 2*(currentTime - 12);

				//Say, if it's already 9.25 pm do not show 9.30 in the time slot. Skip Index.
				if(today.getMinutes() > 25)
					startIndex++;

				if(startIndex < 20){ //If time is less 10 pm (say upto 9.59 pm)
					$scope.timeList = $scope.timeList.slice(startIndex, 21);
				}
			}
			$scope.timeSelected = $scope.timeList[0];
		}
	}


	//Date and Time DEFAULT options
	$scope.dateSelected = $scope.dateList[0];
	$scope.timeSelected = $scope.timeList[0];

	$scope.goBack = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
	};


	$scope.bookTable = function(outlet){

		//Check if not logged in
		if(_.isUndefined(window.localStorage.user)){
			$ionicLoading.show({
				template:  'Please login to make a table reservation',
				duration: 3000
			});
			$state.go('intro.auth-login');
		}
		else{


		$scope.count = 1;

		schedulesPopup = $ionicPopup.show({
			cssClass: 'popup-outer edit-shipping-address-view',
			templateUrl: 'views/content/outlet/reservation.html',
			scope: angular.extend($scope, {}),
			title: 'Book Table',
			buttons: [
				{
					text:'Cancel'
				},
				{
					text:'Confirm',
					onTap: function(e) {

									var reservation = {
										"outlet":outlet,
										"date": $scope.dateSelected.value,
										"time": $scope.timeSelected.value,
										"count":$scope.count
									};

									var data = {};
									data.token = JSON.parse(window.localStorage.user).token;
									data.details = reservation;

									$http({
										method  : 'POST',
										url     : 'http://localhost/vega-web-app/online/newreservation.php',
										data    : data, //forms user object
										headers : {'Content-Type': 'application/x-www-form-urlencoded'}
									 })
									.then(function(respose) {
										$ionicLoading.show({
											template:  '<b style="font-size: 150%">It\'s confirmed!</b><br>We will reserve enough tables for you.',
											duration: 3000
										});
									});
			        }
			    }
			]
		});

	} //else

	}


	$scope.info = outlet;


	$scope.$on('mapInitialized', function(event, map) {
		// If we want to access the map in the future
		$scope.map = map;
	});
})

.controller('TravelContentCtrl', function($scope, $state, $rootScope, product) {
	$scope.goBack = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
  };

	$scope.product = product;
})

.controller('DealsContentCtrl', function($scope, $state, $rootScope, product) {
	$scope.goBack = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
	};

	$scope.product = product;
})

.controller('RealStateContentCtrl', function($scope, $state, $rootScope, product) {
	$scope.goBack = function() {
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
	};

	$scope.product = product;
})




;
