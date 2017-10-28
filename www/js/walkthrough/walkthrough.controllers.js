angular.module('zaitoonFirst.walkthrough.controllers', [])

.controller('welcomeCtrl', function($timeout, menuService, outletService, $scope, $http, $rootScope, $state, $ionicPopover, $ionicPopup, $ionicLoading) {

	//If already logged in?
	if(!_.isUndefined(window.localStorage.user) && window.localStorage.user !=""){
		//Regenerate Token
		var data = {};
		data.token = JSON.parse(window.localStorage.user).token;
		$http({
			method  : 'POST',
			url     : 'https://www.zaitoon.online/services/regeneratetoken.php',
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		 })
		.success(function(response) {
			if(response.status){
				$scope.isLoggedIn = true;
				var temp_user = JSON.parse(window.localStorage.user);
				$scope.loggedUser = temp_user.name;
				temp_user.token = response.newtoken;
				window.localStorage.user = JSON.stringify(temp_user);
			}
			else{
				window.localStorage.removeItem("user");
				$scope.isLoggedIn = false;
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
		menuService.resetAll();
		window.localStorage.clear();
		$state.go('intro.auth-login');
	};

	var outlet = !_.isUndefined(window.localStorage.outlet) ? window.localStorage.outlet : "";
	var locationCode = !_.isUndefined(window.localStorage.locationCode) ? window.localStorage.locationCode : "";

	$scope.changeLocationFlag = !_.isUndefined(window.localStorage.changeLocationFlag) ? window.localStorage.changeLocationFlag : "";

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
	// $http.get('https://www.zaitoon.online/services/fetchcities.php')
	// .then(function(response){
	// 	$scope.cities = response.data.response;
	// });

	$http({
	  method: 'GET',
	  url: 'https://www.zaitoon.online/services/fetchcities.php',
		timeout: 5000
	}).then(function successCallback(response) {
		$scope.cities = response.data.response;
  }, function errorCallback(response) {
			$ionicLoading.show({
				template:  "Please check your connection.",
				duration: 3000
			});
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

	$scope.isCitySet = false;
	$scope.setCity = function(city){
		$scope.isCitySet = true;
		var temp = {name:city};
		$scope.data.selected_city = temp;

		//Set CITY in Outlet service
		var info = {};
		info.city = city;
		outletService.setOutletInfo(info);

		this.updateLocations();

		$scope.city_popover.hide();
	};


	// Choose Location Search
	$scope.updateLocations = function(){
		$scope.search = { query : '' };

		var temp_outlet = outletService.getInfo();
		$http.get('https://www.zaitoon.online/services/popularareas.php?city='+temp_outlet.city)
		.then(function(response){
			$scope.localities = response.data.response;
		});
	}

	//Suggestion function
	$scope.suggest = function() {
		var temp_outlet = outletService.getInfo();
		if($scope.search.query.length > 1){
			$http.get('https://www.zaitoon.online/services/searchareasmobile.php?city='+temp_outlet.city+'&key='+$scope.search.query)
			.then(function(response){
				$scope.localities = response.data;
			});
		}
	}


	  //Choose Locality
		$timeout(function () { //Time delay is added to give time gap for popup to load
		  $ionicPopover.fromTemplateUrl('views/checkout/partials/location-chooser-popover.html', {
		    scope: $scope
		  }).then(function(popover) {
		    $scope.locality_popover = popover;
		  });
		}, 1000);

 	$scope.openLocalityPopover = function($event){
		var temp_outlet = outletService.getInfo();
		if(temp_outlet.city != ""){
			$scope.locality_popover.show($event);
		}
		else{ //City not set.
			$ionicLoading.show({
	      template:  'Please choose a City first',
	      duration: 3000
	    });
		}

	};


	/*
	$rootScope.setRandomOutlet = function(randomOutlet, chosenLocationCode){
		$http.get('https://www.zaitoon.online/services/fetchoutlets.php?outletcode='+randomOutlet+'&locationCode='+chosenLocationCode)
		.then(function(response){

			if(response.data.status){
				//Set outlet and location
				window.localStorage.outlet = response.data.response.outlet;
				window.localStorage.location = response.data.response.location;
				window.localStorage.locationCode = response.data.response.locationCode;

				var info = {};
				info.onlyTakeAway = true;
				info.outlet = response.data.response.outlet;
				info.isSpecial = response.data.response.isSpecial;
				info.city = response.data.response.city;
				info.location = response.data.response.location;
				info.locationCode = response.data.response.locationCode;
				info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
				info.paymentKey = response.data.response.razorpayID;
				info.isTaxCollected = response.data.response.isTaxCollected;
				info.taxPercentage = response.data.response.taxPercentage;
				info.isParcelCollected = response.data.response.isParcelCollected;
				info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
				info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
				info.minAmount = response.data.response.minAmount;
				info.minTime = response.data.response.minTime;
				outletService.setOutletInfo(info);

				var temp = {name:response.data.response.location};
				$scope.data.selected_locality = temp;

				//Clear the changeLocationFlag if at all set.
				window.localStorage.changeLocationFlag = "";

				//LOADING
				$ionicLoading.show({
					template:  '<ion-spinner></ion-spinner>'
				});


				//Go back to the checkout page (if it was redirected to set location)
				$timeout(function () {
					if(window.localStorage.backFlag){
						$timeout(function () {
							window.localStorage.removeItem("backFlag");
							$state.go('main.app.shopping-cart'); //Because, we need to reset the DELIVERY Flag
						}, 200);
					}
					else if(window.localStorage.backFlagCart){
						$timeout(function () {
							window.localStorage.removeItem("backFlagCart");
							$state.go('main.app.shopping-cart');
						}, 200);
					}
					else{
						$scope.isLocationSet = true;
					}
					$ionicLoading.hide();
				}, 1000);

			}
		});
	}
*/


	$rootScope.setLocality = function(locationCode){

		console.log('Setting locaton');

		$scope.locality_popover.hide();
		$timeout(function () {


    $http({
        method : "GET",
        url : 'https://www.zaitoon.online/services/fetchoutlets.php?locationCode='+locationCode
    }).then(function(response){
					if(response.data.status){
						console.log(response.data)
						//Serviced Areas
						if(response.data.isServed){

							//Set outlet and location
							window.localStorage.outlet = response.data.response.outlet;
							window.localStorage.location = response.data.response.location;
							window.localStorage.locationCode = response.data.response.locationCode;

							var info = {};
							info.onlyTakeAway = !response.data.isServed;
							info.outlet = response.data.response.outlet;
							info.isSpecial = response.data.response.isSpecial;
					    info.city = response.data.response.city;
					    info.location = response.data.response.location;
							info.locationCode = response.data.response.locationCode;
					    info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
							info.isOpen = response.data.response.isOpen;
							info.paymentKey = response.data.response.razorpayID;
					    info.isTaxCollected = response.data.response.isTaxCollected;
					    info.taxPercentage = response.data.response.taxPercentage;
					    info.isParcelCollected = response.data.response.isParcelCollected;
					    info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
					    info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
					    info.minAmount = response.data.response.minAmount;
					    info.minTime = response.data.response.minTime;
							outletService.setOutletInfo(info);

							menuService.resetAll();

							var temp = {name:response.data.response.location};
							$scope.data.selected_locality = temp;

							//Clear the changeLocationFlag if at all set.
							window.localStorage.changeLocationFlag = "";

							//LOADING
							$ionicLoading.show({
								template:  '<ion-spinner></ion-spinner>'
							});


							//Go back to the checkout page (if it was redirected to set location)
							$timeout(function () {
								if(window.localStorage.backFlag){
									window.localStorage.removeItem("backFlag");
									$state.go('main.app.checkout');
								}
								else if(window.localStorage.backFlagCart){
									window.localStorage.removeItem("backFlagCart");
									$state.go('main.app.shopping-cart');
								}
								else{
									$scope.isLocationSet = true;
								}
								$ionicLoading.hide();
							}, 1000);
						}
						//NOT SERVICED AREAS
						else{
							//Warn Only Takeaway Possible.
							$ionicPopup.show({
										title: "Can not be delivered to selected area",
										subTitle: 'You can place only Take Away orders',
										cssClass: 'delivery-unavailable-popup',
										scope: $scope,
										buttons: [
											{ text: 'Cancel', onTap: function(e) { return true; } },
											{
												text: '<b>OK</b>',
												type: 'button-balanced',
												onTap: function(e) {
													//Set outlet and location
													window.localStorage.outlet = response.data.response.outlet;
													window.localStorage.location = response.data.response.location;
													window.localStorage.locationCode = response.data.response.locationCode;

													var info = {};
													info.onlyTakeAway = !response.data.isServed;
													info.outlet = response.data.response.outlet;
													info.isSpecial = response.data.response.isSpecial;
													info.city = response.data.response.city;
													info.location = response.data.response.location;
													info.locationCode = response.data.response.locationCode;
													info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
													info.isOpen = response.data.response.isOpen;
													info.paymentKey = response.data.response.razorpayID;
													info.isTaxCollected = response.data.response.isTaxCollected;
													info.taxPercentage = response.data.response.taxPercentage;
													info.isParcelCollected = response.data.response.isParcelCollected;
													info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
													info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
													info.minAmount = response.data.response.minAmount;
													info.minTime = response.data.response.minTime;
													outletService.setOutletInfo(info);

													var temp = {name:response.data.response.location};
													$scope.data.selected_locality = temp;

													//Clear the changeLocationFlag if at all set.
													window.localStorage.changeLocationFlag = "";

													//LOADING
													$ionicLoading.show({
														template:  '<ion-spinner></ion-spinner>'
													});


													//Go back to the checkout page (if it was redirected to set location)
													$timeout(function () {
														if(window.localStorage.backFlag){
															window.localStorage.removeItem("backFlag");
															$state.go('main.app.checkout');
														}
														else if(window.localStorage.backFlagCart){
															window.localStorage.removeItem("backFlagCart");
															$state.go('main.app.shopping-cart');
														}
														else{
															$scope.isLocationSet = true;
														}
														$ionicLoading.hide();
													}, 1000);
												}
											},
										]
								});
						}
					}
					else{
						$ionicLoading.show({
							template:  response.data.error,
							duration: 2000
						});
					}
				});


		// $http.get('https://www.zaitoon.online/services/fetchoutlets.php?locationCode='+locationCode)
		// .then(function(response){
		// 	if(response.data.status){
		// 		console.log(response.data)
		// 		//Serviced Areas
		// 		if(response.data.isServed){
		//
		// 			//Set outlet and location
		// 			window.localStorage.outlet = response.data.response.outlet;
		// 			window.localStorage.location = response.data.response.location;
		// 			window.localStorage.locationCode = response.data.response.locationCode;
		//
		// 			var info = {};
		// 			info.onlyTakeAway = !response.data.isServed;
		// 			info.outlet = response.data.response.outlet;
		// 			info.isSpecial = response.data.response.isSpecial;
		// 	    info.city = response.data.response.city;
		// 	    info.location = response.data.response.location;
		// 			info.locationCode = response.data.response.locationCode;
		// 	    info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
		// 			info.isOpen = response.data.response.isOpen;
		// 			info.paymentKey = response.data.response.razorpayID;
		// 	    info.isTaxCollected = response.data.response.isTaxCollected;
		// 	    info.taxPercentage = response.data.response.taxPercentage;
		// 	    info.isParcelCollected = response.data.response.isParcelCollected;
		// 	    info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
		// 	    info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
		// 	    info.minAmount = response.data.response.minAmount;
		// 	    info.minTime = response.data.response.minTime;
		// 			outletService.setOutletInfo(info);
		//
		// 			menuService.resetAll();
		//
		// 			var temp = {name:response.data.response.location};
		// 			$scope.data.selected_locality = temp;
		//
		// 			//Clear the changeLocationFlag if at all set.
		// 			window.localStorage.changeLocationFlag = "";
		//
		// 			//LOADING
		// 			$ionicLoading.show({
		// 				template:  '<ion-spinner></ion-spinner>'
		// 			});
		//
		//
		// 			//Go back to the checkout page (if it was redirected to set location)
		// 			$timeout(function () {
		// 				if(window.localStorage.backFlag){
		// 					window.localStorage.removeItem("backFlag");
		// 					$state.go('main.app.checkout');
		// 				}
		// 				else if(window.localStorage.backFlagCart){
		// 					window.localStorage.removeItem("backFlagCart");
		// 					$state.go('main.app.shopping-cart');
		// 				}
		// 				else{
		// 					$scope.isLocationSet = true;
		// 				}
		// 				$ionicLoading.hide();
		// 			}, 1000);
		// 		}
		// 		//NOT SERVICED AREAS
		// 		else{
		// 			//Warn Only Takeaway Possible.
		// 			$ionicPopup.show({
		// 						title: "Can not be delivered to selected area",
		// 						subTitle: 'You can place only Take Away orders',
		// 						cssClass: 'delivery-unavailable-popup',
		// 						scope: $scope,
		// 						buttons: [
		// 							{ text: 'Cancel', onTap: function(e) { return true; } },
		// 							{
		// 								text: '<b>OK</b>',
		// 								type: 'button-balanced',
		// 								onTap: function(e) {
		// 									//Set outlet and location
		// 									window.localStorage.outlet = response.data.response.outlet;
		// 									window.localStorage.location = response.data.response.location;
		// 									window.localStorage.locationCode = response.data.response.locationCode;
		//
		// 									var info = {};
		// 									info.onlyTakeAway = !response.data.isServed;
		// 									info.outlet = response.data.response.outlet;
		// 									info.isSpecial = response.data.response.isSpecial;
		// 									info.city = response.data.response.city;
		// 									info.location = response.data.response.location;
		// 									info.locationCode = response.data.response.locationCode;
		// 									info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
		// 									info.isOpen = response.data.response.isOpen;
		// 									info.paymentKey = response.data.response.razorpayID;
		// 									info.isTaxCollected = response.data.response.isTaxCollected;
		// 									info.taxPercentage = response.data.response.taxPercentage;
		// 									info.isParcelCollected = response.data.response.isParcelCollected;
		// 									info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
		// 									info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
		// 									info.minAmount = response.data.response.minAmount;
		// 									info.minTime = response.data.response.minTime;
		// 									outletService.setOutletInfo(info);
		//
		// 									var temp = {name:response.data.response.location};
		// 									$scope.data.selected_locality = temp;
		//
		// 									//Clear the changeLocationFlag if at all set.
		// 									window.localStorage.changeLocationFlag = "";
		//
		// 									//LOADING
		// 									$ionicLoading.show({
		// 										template:  '<ion-spinner></ion-spinner>'
		// 									});
		//
		//
		// 									//Go back to the checkout page (if it was redirected to set location)
		// 									$timeout(function () {
		// 										if(window.localStorage.backFlag){
		// 											window.localStorage.removeItem("backFlag");
		// 											$state.go('main.app.checkout');
		// 										}
		// 										else if(window.localStorage.backFlagCart){
		// 											window.localStorage.removeItem("backFlagCart");
		// 											$state.go('main.app.shopping-cart');
		// 										}
		// 										else{
		// 											$scope.isLocationSet = true;
		// 										}
		// 										$ionicLoading.hide();
		// 									}, 1000);
		// 								}
		// 							},
		// 						]
		// 				});
		// 		}
		// 	}
		// 	else{
		// 		$ionicLoading.show({
		// 			template:  response.data.error,
		// 			duration: 2000
		// 		});
		// 	}
		// });


	}, 1500);

	};



	//Reset Location on next iteration
	if(!_.isUndefined(window.localStorage.locationCode) && window.localStorage.locationCode != "")
	{
		//LOADING
		$ionicLoading.show({
			template:  '<ion-spinner></ion-spinner>'
		});

		$http.get('https://www.zaitoon.online/services/fetchoutlets.php?locationCode='+window.localStorage.locationCode)
		.then(function(response){
			$ionicLoading.hide();

			if(response.data.status){
					//Set outlet and location
					window.localStorage.outlet = response.data.response.outlet;
					window.localStorage.location = response.data.response.location;
					window.localStorage.locationCode = response.data.response.locationCode;

					var info = {};
					info.onlyTakeAway = !response.data.isServed;
					info.outlet = response.data.response.outlet;
					info.isSpecial = response.data.response.isSpecial;
			    info.city = response.data.response.city;
			    info.location = response.data.response.location;
					info.locationCode = response.data.response.locationCode;
			    info.isAcceptingOnlinePayment = response.data.response.isAcceptingOnlinePayment;
					info.isOpen = response.data.response.isOpen;
					info.paymentKey = response.data.response.razorpayID;
			    info.isTaxCollected = response.data.response.isTaxCollected;
			    info.taxPercentage = response.data.response.taxPercentage;
			    info.isParcelCollected = response.data.response.isParcelCollected;
			    info.parcelPercentageDelivery = response.data.response.parcelPercentageDelivery;
			    info.parcelPercentagePickup = response.data.response.parcelPercentagePickup;
			    info.minAmount = response.data.response.minAmount;
			    info.minTime = response.data.response.minTime;
					outletService.setOutletInfo(info);
			}
			else{
				$ionicLoading.show({
					template:  response.data.error,
					duration: 2000
				});
			}
		});
	}

})

;
