angular.module('zaitoonFirst.feed.controllers', ['ionic', 'ionic.contrib.ui.hscrollcards'])


.controller('FeedCtrl', function($scope,  $ionicScrollDelegate, ShoppingCartService) {
	$scope.getProductsInCart = function(){
		return ShoppingCartService.getProducts().length;
	};
})

.controller('featureCtrl', function($scope) {

  $scope.items = [];

    var tmp = [
      {desc: 'The Ramones', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSulfJcjBhxxW2NBBn9KbE3B4BSeh0R7mQ38wUi_zpJlQrMoDWh_qFcMelE_tjtAERUPTc'},
      {desc: 'The Beatles', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTGpH07f9zeucoOs_stZyIFtBncU-Z8TDYmJgoFnlnxYmXjJEaitmxZNDkNvYnCzwWTySM'},
      {desc: 'Pink Floyd', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT-FbU5dD_Wz472srRIvoZAhyGTEytx9HWGusbhYgSc2h0N6AqqRrDwzApmyxZoIlyxDcU'},
      {desc: 'The Rolling Stones', image:'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6uwPPBnHfAAUcSzxr3iq9ou1CZ4f_Zc2O76i5A4IyoymIVwjOMXwUFTGSrVGcdGT9vQY'},
      {desc: 'Chicken Salamy', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRA3jz0uhVypONAKWUve80Q6HASvuvZiohl4Sru5ZihkAsjWiaGjocfxd0aC3H7EeFk5-I'},
      {desc: 'Van Halen', image:'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRIslVN9cJJ6YuV0y7JihAyA63JDhXGhkCVxHIRE-IoaF-rpefjIXO5osA24QvN9iCptC8'}
    ];
    $scope.items = $scope.items.concat(tmp);

})



.controller('FoodArabianCtrl', function(menuService, outletService, ConnectivityMonitor, reviewOrderService, $scope, $state, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup, $timeout) {

	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

	//LOADING
	$ionicLoading.show({
		template:  '<ion-spinner></ion-spinner>'
	});

	//Check if already cached
	var isCached = menuService.getIsLoadedFlag('ARABIAN');


/* DO NOT REMOVE OR DELETE THIS PART
	//Check if location code is set in localStorage and update it
	if(!_.isUndefined(window.localStorage.locationCode)){
		$http.get('https://www.zaitoon.online/services/fetchoutlets.php?locationCode='+window.localStorage.locationCode)
		.then(function(response){

			//Set outlet and location
			window.localStorage.outlet = response.data.response.outlet;
			window.localStorage.location = response.data.response.location;
			window.localStorage.locationCode = response.data.response.locationCode;

			var info = {};
			info.onlyTakeAway = false;
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
		});
	}

*/


	//Check if feedback is submited for latest completed order
	if(!_.isUndefined(window.localStorage.user)){
		var mydata = {};
		mydata.token = JSON.parse(window.localStorage.user).token;

		$http({
			method  : 'POST',
			url     : 'https://www.zaitoon.online/services/getlatestorderid.php',
			data    : mydata,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		 })
		.then(function(response) {
			if(response.data.status){
				reviewOrderService.setLatest(response.data.response);
				$state.go('main.app.checkout.feedback');
			}
		});
	}


	var custom_filter = !_.isUndefined(window.localStorage.customFilter) ? window.localStorage.customFilter : [];

	//To display things if filter is applied
	if(custom_filter.length > 0)
		$scope.isFilter = true;
	else
		$scope.isFilter = false;


	//Receiving Broadcast - If Filter Applied
	$rootScope.$on('filter_applied', function(event, filter) {
		window.localStorage.customFilter = JSON.stringify(filter);
    	$scope.reinitializeMenu();
  	});

  	$scope.clearFilter = function(){
		$scope.isFilter = false;
		window.localStorage.removeItem("customFilter");
		custom_filter = [];
		$scope.reinitializeMenu();
	}

	$scope.showNotAvailable = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #e74c3c; font-size: 140%">Oops!</b><br>'+product.itemName+' is not available.',
			duration: 1000
		});
	}

	$scope.outletSelection = outletService.getInfo();
	if($scope.outletSelection.outlet == ""){
		$myOutlet = "VELACHERY";
	}
	else{
		$myOutlet = $scope.outletSelection.outlet;
	}

	$scope.isOutletClosedNow = !$scope.outletSelection.isOpen;
	$scope.outletClosureWarning = true;
	$scope.clearClosureWarning = function() {
		$scope.outletClosureWarning = false;
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
        var data = {};
        data.cuisine = "ARABIAN";
        data.isFilter = false;
				data.outlet = $myOutlet;

        if(custom_filter.length > 0){
        	data.isFilter = true;
        	data.filter = custom_filter;
    	}

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

			if(data.isFilter || !isCached){
				$http({
          method  : 'POST',
          url     : 'https://www.zaitoon.online/services/fetchmenu.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
						if($scope.menu.length == 0){
							$scope.isEmpty = true;
						}
						else{
							$scope.isEmpty = false;
						}
						//Caching Part
						if(!data.isFilter){
							//add to Cache if it's not filter applied Search
							window.localStorage.arabianCache = JSON.stringify($scope.menu);
							menuService.setLoadFlag('ARABIAN', true);
						}
        });
			}
			else{
				//Don't call http. Load from cache only.
				$scope.menu = JSON.parse(window.localStorage.arabianCache);
				$ionicLoading.hide();
			}
    }

		if(isCached){
			init();
		}
		else{
			$timeout(function () {
					init();
			}, 799);
		}


    //For Search field
	$scope.search = { query : '' };
	$scope.showSearch = false;


	$scope.resetSearch = function(){
		$scope.search = { query : '' };
		$scope.showSearch = !$scope.showSearch;
	}


	  $scope.customOptions = function(product) {

	  	//Render Template
	  	var i = 0;
	  	$scope.choiceName = "";
	  	$scope.choicePrice = "";
	  	var choiceTemplate = '<div class="padding">';
	  	while(i < product.custom.length){
	  		choiceTemplate = choiceTemplate + '<ion-radio ng-click="addCustomItem(\''+product.custom[i].customName+'\', '+product.custom[i].customPrice+')">'+product.custom[i].customName+' <tag style="font-size: 80%; color: #d35400">Rs. '+product.custom[i].customPrice+'</tag></ion-radio>';
	  		i++;
	  	}
	  	choiceTemplate = choiceTemplate + '</div>';

	    var newCustomPopup = $ionicPopup.show({
	      cssClass: 'popup-outer new-shipping-address-view',
	      template: choiceTemplate,
	      title: 'Choose Options',
	      scope: $scope,
	      buttons: [
	        { text: 'Cancel' }
	      ]
	    });
	    $scope.addCustomItem = function(variant, price){
	    	$scope.choiceName = variant;
	  		$scope.choicePrice = price;

            if($scope.choiceName != "" && $scope.choicePrice != ""){
            	product.itemPrice = $scope.choicePrice;
            	product.variant = $scope.choiceName;

            	$scope.addToCart(product);
            	newCustomPopup.close();
            }

	    }

	  }



	$scope.addToCart = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #f1c40f">'+product.itemName+'</b> is added.',
			duration: 1000
		});

		product.qty = 1;
		console.log(product)
  	    ShoppingCartService.addProduct(product);
  	};


})

.controller('FoodChineseCtrl', function(menuService, outletService, ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup, $timeout) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

	//LOADING
	$ionicLoading.show({
		template:  '<ion-spinner></ion-spinner>'
	});


		//Check if already cached
		var isCached = menuService.getIsLoadedFlag('CHINESE');



	var custom_filter = !_.isUndefined(window.localStorage.customFilter) ? window.localStorage.customFilter : [];

	//To display things if filter is applied
	if(custom_filter.length > 0)
		$scope.isFilter = true;
	else
		$scope.isFilter = false;


	//Receiving Broadcast - If Filter Applied
	$rootScope.$on('filter_applied', function(event, filter) {
		window.localStorage.customFilter = JSON.stringify(filter);
    	$scope.reinitializeMenu();
  	});

  	$scope.clearFilter = function(){
		$scope.isFilter = false;
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	$scope.outletSelection = outletService.getInfo();
	if($scope.outletSelection.outlet == ""){
		$myOutlet = "VELACHERY";
	}
	else{
		$myOutlet = $scope.outletSelection.outlet;
	}

	$scope.isOutletClosedNow = !$scope.outletSelection.isOpen;
	$scope.outletClosureWarning = true;
	$scope.clearClosureWarning = function() {
		$scope.outletClosureWarning = false;
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
				var data = {};
				data.cuisine = "CHINESE";
				data.isFilter = false;
				data.outlet = $myOutlet;

				if(custom_filter.length > 0){
					data.isFilter = true;
					data.filter = custom_filter;
			}

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

			if(data.isFilter || !isCached){
				$http({
					method  : 'POST',
					url     : 'https://www.zaitoon.online/services/fetchmenu.php',
					data    : data,
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				 })
				.then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
						if($scope.menu.length == 0){
							$scope.isEmpty = true;
						}
						else{
							$scope.isEmpty = false;
						}
						//Caching Part
						if(!data.isFilter){
							//add to Cache if it's not filter applied Search
							window.localStorage.chineseCache = JSON.stringify($scope.menu);
							menuService.setLoadFlag('CHINESE', true);
						}
				});
			}
			else{
				//Don't call http. Load from cache only.
				$scope.menu = JSON.parse(window.localStorage.chineseCache);
				$ionicLoading.hide();
			}
		}

		if(isCached){
			init();
		}
		else{
			$timeout(function () {
					init();
			}, 799);
		}


    //For Search field
	$scope.search = { query : '' };
	$scope.showSearch = false;


	$scope.resetSearch = function(){
		$scope.search = { query : '' };
		$scope.showSearch = !$scope.showSearch;
	}


	  $scope.customOptions = function(product) {

	  	//Render Template
	  	var i = 0;
	  	$scope.choiceName = "";
	  	$scope.choicePrice = "";
	  	var choiceTemplate = '<div class="padding">';
	  	while(i < product.custom.length){
	  		choiceTemplate = choiceTemplate + '<ion-radio ng-click="addCustomItem(\''+product.custom[i].customName+'\', '+product.custom[i].customPrice+')">'+product.custom[i].customName+' <tag style="font-size: 80%; color: #d35400">Rs. '+product.custom[i].customPrice+'</tag></ion-radio>';
	  		i++;
	  	}
	  	choiceTemplate = choiceTemplate + '</div>';

	    var newCustomPopup = $ionicPopup.show({
	      cssClass: 'popup-outer new-shipping-address-view',
	      template: choiceTemplate,
	      title: 'Choose Options',
	      scope: $scope,
	      buttons: [
	        { text: 'Cancel' }
	      ]
	    });
	    $scope.addCustomItem = function(variant, price){
	    	$scope.choiceName = variant;
	  		$scope.choicePrice = price;

            if($scope.choiceName != "" && $scope.choicePrice != ""){
            	product.itemPrice = $scope.choicePrice;
            	product.variant = $scope.choiceName;

            	$scope.addToCart(product);
            	newCustomPopup.close();
            }

	    }

	  }



	$scope.addToCart = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #f1c40f">'+product.itemName+'</b> is added.',
			duration: 1000
		});

		product.qty = 1;
  	    ShoppingCartService.addProduct(product);
  	};


})


.controller('FoodIndianCtrl', function(menuService, outletService, ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup, $timeout) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

	//LOADING
	$ionicLoading.show({
		template:  '<ion-spinner></ion-spinner>'
	});


		//Check if already cached
		var isCached = menuService.getIsLoadedFlag('INDIAN');


	var custom_filter = !_.isUndefined(window.localStorage.customFilter) ? window.localStorage.customFilter : [];

	//To display things if filter is applied
	if(custom_filter.length > 0)
		$scope.isFilter = true;
	else
		$scope.isFilter = false;


	//Receiving Broadcast - If Filter Applied
	$rootScope.$on('filter_applied', function(event, filter) {
		window.localStorage.customFilter = JSON.stringify(filter);
    	$scope.reinitializeMenu();
  	});

  	$scope.clearFilter = function(){
		$scope.isFilter = false;
		window.localStorage.removeItem("customFilter");
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	$scope.outletSelection = outletService.getInfo();
	if($scope.outletSelection.outlet == ""){
		$myOutlet = "VELACHERY";
	}
	else{
		$myOutlet = $scope.outletSelection.outlet;
	}

	$scope.isOutletClosedNow = !$scope.outletSelection.isOpen;
	$scope.outletClosureWarning = true;
	$scope.clearClosureWarning = function() {
		$scope.outletClosureWarning = false;
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
				var data = {};
				data.cuisine = "INDIAN";
				data.isFilter = false;
				data.outlet = $myOutlet;

				if(custom_filter.length > 0){
					data.isFilter = true;
					data.filter = custom_filter;
			}

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

			if(data.isFilter || !isCached){
				$http({
					method  : 'POST',
					url     : 'https://www.zaitoon.online/services/fetchmenu.php',
					data    : data,
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				 })
				.then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
						if($scope.menu.length == 0){
							$scope.isEmpty = true;
						}
						else{
							$scope.isEmpty = false;
						}
						//Caching Part
						if(!data.isFilter){
							//add to Cache if it's not filter applied Search
							window.localStorage.indianCache = JSON.stringify($scope.menu);
							menuService.setLoadFlag('INDIAN', true);
						}
				});
			}
			else{
				//Don't call http. Load from cache only.
				$scope.menu = JSON.parse(window.localStorage.indianCache);
				$ionicLoading.hide();
			}
		}

		if(isCached){
			init();
		}
		else{
			$timeout(function () {
					init();
			}, 799);
		}




    //For Search field
	$scope.search = { query : '' };
	$scope.showSearch = false;


	$scope.resetSearch = function(){
		$scope.search = { query : '' };
		$scope.showSearch = !$scope.showSearch;
	}


	  $scope.customOptions = function(product) {

	  	//Render Template
	  	var i = 0;
	  	$scope.choiceName = "";
	  	$scope.choicePrice = "";
	  	var choiceTemplate = '<div class="padding">';
	  	while(i < product.custom.length){
	  		choiceTemplate = choiceTemplate + '<ion-radio ng-click="addCustomItem(\''+product.custom[i].customName+'\', '+product.custom[i].customPrice+')">'+product.custom[i].customName+' <tag style="font-size: 80%; color: #d35400">Rs. '+product.custom[i].customPrice+'</tag></ion-radio>';
	  		i++;
	  	}
	  	choiceTemplate = choiceTemplate + '</div>';

	    var newCustomPopup = $ionicPopup.show({
	      cssClass: 'popup-outer new-shipping-address-view',
	      template: choiceTemplate,
	      title: 'Choose Options',
	      scope: $scope,
	      buttons: [
	        { text: 'Cancel' }
	      ]
	    });
	    $scope.addCustomItem = function(variant, price){
	    	$scope.choiceName = variant;
	  		$scope.choicePrice = price;

            if($scope.choiceName != "" && $scope.choicePrice != ""){
            	product.itemPrice = $scope.choicePrice;
            	product.variant = $scope.choiceName;

            	$scope.addToCart(product);
            	newCustomPopup.close();
            }

	    }

	  }



	$scope.addToCart = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #f1c40f">'+product.itemName+'</b> is added.',
			duration: 1000
		});

		product.qty = 1;
  	    ShoppingCartService.addProduct(product);
  	};


})

.controller('FoodDessertCtrl', function(menuService, outletService, ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup, $timeout) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}

	//LOADING
	$ionicLoading.show({
		template:  '<ion-spinner></ion-spinner>'
	});


		//Check if already cached
		var isCached = menuService.getIsLoadedFlag('DESSERT');


	var custom_filter = !_.isUndefined(window.localStorage.customFilter) ? window.localStorage.customFilter : [];

	//To display things if filter is applied
	if(custom_filter.length > 0)
		$scope.isFilter = true;
	else
		$scope.isFilter = false;


	//Receiving Broadcast - If Filter Applied
	$rootScope.$on('filter_applied', function(event, filter) {
		window.localStorage.customFilter = JSON.stringify(filter);
    	$scope.reinitializeMenu();
  	});

  	$scope.clearFilter = function(){
		$scope.isFilter = false;
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}

	$scope.outletSelection = outletService.getInfo();
	if($scope.outletSelection.outlet == ""){
		$myOutlet = "VELACHERY";
	}
	else{
		$myOutlet = $scope.outletSelection.outlet;
	}

	$scope.isOutletClosedNow = !$scope.outletSelection.isOpen;
	$scope.outletClosureWarning = true;
	$scope.clearClosureWarning = function() {
		$scope.outletClosureWarning = false;
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
				var data = {};
				data.cuisine = "CHINESE";
				data.isFilter = false;
				data.outlet = $myOutlet;

				if(custom_filter.length > 0){
					data.isFilter = true;
					data.filter = custom_filter;
			}

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

			if(data.isFilter || !isCached){
				$http({
					method  : 'POST',
					url     : 'https://www.zaitoon.online/services/fetchmenu.php',
					data    : data,
					headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				 })
				.then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
						if($scope.menu.length == 0){
							$scope.isEmpty = true;
						}
						else{
							$scope.isEmpty = false;
						}
						//Caching Part
						if(!data.isFilter){
							//add to Cache if it's not filter applied Search
							window.localStorage.dessertCache = JSON.stringify($scope.menu);
							menuService.setLoadFlag('DESSERT', true);
						}
				});
			}
			else{
				//Don't call http. Load from cache only.
				$scope.menu = JSON.parse(window.localStorage.dessertCache);
				$ionicLoading.hide();
			}
		}

		if(isCached){
			init();
		}
		else{
			$timeout(function () {
					init();
			}, 799);
		}

    //For Search field
	$scope.search = { query : '' };
	$scope.showSearch = false;


	$scope.resetSearch = function(){
		$scope.search = { query : '' };
		$scope.showSearch = !$scope.showSearch;
	}


	  $scope.customOptions = function(product) {

	  	//Render Template
	  	var i = 0;
	  	$scope.choiceName = "";
	  	$scope.choicePrice = "";
	  	var choiceTemplate = '<div class="padding">';
	  	while(i < product.custom.length){
	  		choiceTemplate = choiceTemplate + '<ion-radio ng-click="addCustomItem(\''+product.custom[i].customName+'\', '+product.custom[i].customPrice+')">'+product.custom[i].customName+' <tag style="font-size: 80%; color: #d35400">Rs. '+product.custom[i].customPrice+'</tag></ion-radio>';
	  		i++;
	  	}
	  	choiceTemplate = choiceTemplate + '</div>';

	    var newCustomPopup = $ionicPopup.show({
	      cssClass: 'popup-outer new-shipping-address-view',
	      template: choiceTemplate,
	      title: 'Choose Options',
	      scope: $scope,
	      buttons: [
	        { text: 'Cancel' }
	      ]
	    });
	    $scope.addCustomItem = function(variant, price){
	    	$scope.choiceName = variant;
	  		$scope.choicePrice = price;

            if($scope.choiceName != "" && $scope.choicePrice != ""){
            	product.itemPrice = $scope.choicePrice;
            	product.variant = $scope.choiceName;

            	$scope.addToCart(product);
            	newCustomPopup.close();
            }

	    }

	  }



	$scope.addToCart = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #f1c40f">'+product.itemName+'</b> is added.',
			duration: 1000
		});

		product.qty = 1;
  	    ShoppingCartService.addProduct(product);
  	};


})



.controller('DealsCtrl', function(outletService, $ionicLoading, ShoppingCartService, ConnectivityMonitor, $scope, $http, $ionicPopup, $state) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}


	//Book a Table
	$scope.showOutlets = function(){

		if($scope.isOfflineFlag){
			$ionicLoading.show({
				template:  'Please connect to Internet',
				duration: 2000
			});
		}
		else{
			//Get all the outlets
			$http.get('https://www.zaitoon.online/services/fetchoutlets.php')
			.then(function(response){
						$scope.allList = response.data.response;
				});

			outletsPopup = $ionicPopup.show({
				cssClass: 'popup-outer edit-shipping-address-view',
				templateUrl: 'views/content/outlet/outlets.html',
				scope: angular.extend($scope, {}),
				title: 'Select Outlet',
				buttons: [
					{
						text:'Cancel'
					}
				]
			});

				//Goto Outlet's page
				$scope.gotoOutlet = function(){
					outletsPopup.close();
				}
		}
	}


	// $http.get('https://www.zaitoon.online/services/fetchdeals.php')
	// .then(function(response){
  //     	$scope.deals = response.data.response;
	// 			$scope.isEmpty = !response.data.status;
  // });



	$scope.outletSelection = outletService.getInfo();
	if($scope.outletSelection.outlet == ""){
		$myOutlet = "VELACHERY";
	}
	else{
		$myOutlet = $scope.outletSelection.outlet;
	}

	$scope.isOutletClosedNow = !$scope.outletSelection.isOpen;
	$scope.outletClosureWarning = true;
	$scope.clearClosureWarning = function() {
		$scope.outletClosureWarning = false;
	}


//Fetch COMBO OFFERS
console.log('https://www.zaitoon.online/services/fetchcombos.php?outlet='+$myOutlet)
$http.get('https://www.zaitoon.online/services/fetchcombos.php?outlet='+$myOutlet)
.then(function(response) {
	$scope.combos = response.data.response;
	$scope.isCombosEmpty = !response.data.status;
	console.log($scope.combos)
});

$scope.addComboToCart = function(combo) {
	$ionicLoading.show({
		template:  '<b style="color: #f1c40f">'+combo.itemName+'</b> is added to cart.',
		duration: 2000
	});

			combo.qty = 1;
			console.log(combo)
			ShoppingCartService.addProduct(combo);
};





		$http.get('https://www.zaitoon.online/services/fetchdeals.php?id=0')
	  .then(function(response) {
			$scope.deals = response.data.response;
			$scope.isEmpty = !response.data.status;

	    $scope.left = 1;
	  });


	  $scope.limiter = 5;
	  $scope.loadMore = function() {
			$http.get('https://www.zaitoon.online/services/fetchdeals.php?id='+$scope.limiter)
		  .then(function(items) {
				if(items.data.response.length == 0){
	        $scope.left = 0;
	      }
	      $scope.deals = $scope.deals.concat(items.data.response)
	      $scope.limiter+=5;
	      $scope.$broadcast('scroll.infiniteScrollComplete');
		  });
	  };


})

;
