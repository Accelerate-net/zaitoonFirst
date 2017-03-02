angular.module('zaitoonFirst.feed.controllers', [])


.controller('FeedCtrl', function($scope,  $ionicScrollDelegate, ShoppingCartService) {
	$scope.getProductsInCart = function(){
		return ShoppingCartService.getProducts().length;
	};
})


.controller('FoodArabianCtrl', function(ConnectivityMonitor, reviewOrderService, $scope, $state, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {

	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}


	//Check if feedback is submited for latest completed order
	if(!_.isUndefined(window.localStorage.user)){
		var mydata = {};
		mydata.token = JSON.parse(window.localStorage.user).token;

		$http({
			method  : 'POST',
			url     : 'http://www.zaitoon.online/services/getlatestorderid.php',
			data    : mydata, //forms user object
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
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
        var data = {};
        data.cuisine = "ARABIAN";
        data.isFilter = false;

        if(custom_filter.length > 0){
        	data.isFilter = true;
        	data.filter = custom_filter;
    	}

			//LOADING
			$ionicLoading.show({
				template:  '<ion-spinner></ion-spinner>'
			});

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

        $http({
          method  : 'POST',
          url     : 'http://www.zaitoon.online/services/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
					if($scope.menu.length == 0)
						$scope.isEmpty = true;
					else
						$scope.isEmpty = false;
        });
    }

    init();


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

.controller('FoodChineseCtrl', function(ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
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
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
        var data = {};
        data.cuisine = "CHINESE";
        data.isFilter = false;

        if(custom_filter.length > 0){
        	data.isFilter = true;
        	data.filter = custom_filter;
    	}


			//LOADING
			$ionicLoading.show({
				template:  '<ion-spinner></ion-spinner>'
			});

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}

        $http({
          method  : 'POST',
          url     : 'http://www.zaitoon.online/services/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
					if($scope.menu.length == 0)
						$scope.isEmpty = true;
					else
						$scope.isEmpty = false;
        });
    }

    init();


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


.controller('FoodIndianCtrl', function(ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
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
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
        var data = {};
        data.cuisine = "INDIAN";
        data.isFilter = false;

        if(custom_filter.length > 0){
        	data.isFilter = true;
        	data.filter = custom_filter;
    	}

			//LOADING
			$ionicLoading.show({
				template:  '<ion-spinner></ion-spinner>'
			});

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}


        $http({
          method  : 'POST',
          url     : 'http://www.zaitoon.online/services/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
					if($scope.menu.length == 0)
						$scope.isEmpty = true;
					else
						$scope.isEmpty = false;
        });
    }

    init();


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

.controller('FoodDessertCtrl', function(ConnectivityMonitor, $scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
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
		window.localStorage.customFilter = "";
		custom_filter = [];
		$scope.reinitializeMenu();
	}


	// Making request to server to fetch-menu
	var init = $scope.reinitializeMenu = function(){
        var data = {};
        data.cuisine = "DESSERTS";
        data.isFilter = false;

        if(custom_filter.length > 0){
        	data.isFilter = true;
        	data.filter = custom_filter;
    	}


			//LOADING
			$ionicLoading.show({
				template:  '<ion-spinner></ion-spinner>'
			});

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.hide();
			}


        $http({
          method  : 'POST',
          url     : 'http://www.zaitoon.online/services/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
					$ionicLoading.hide();

					$scope.menu = response.data;
					if($scope.menu.length == 0)
						$scope.isEmpty = true;
					else
						$scope.isEmpty = false;
        });
    }

    init();


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



.controller('DealsCtrl', function($ionicLoading, ShoppingCartService, ConnectivityMonitor, $scope, $http, $ionicPopup, $state, OutletService) {


	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}


	//Book a Table
	$scope.showOutlets = function(){

		//Get all the outlets
		$http.get('http://www.zaitoon.online/services/fetchoutlets.php')
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


	// $http.get('http://www.zaitoon.online/services/fetchdeals.php')
	// .then(function(response){
  //     	$scope.deals = response.data.response;
	// 			$scope.isEmpty = !response.data.status;
  // });


//Fetch COMBO OFFERS
$http.get('http://www.zaitoon.online/services/fetchcombos.php?outlet=VELACHERY')
.then(function(response) {
	$scope.combos = response.data.response;
	$scope.isCombosEmpty = !response.data.status;
	console.log($scope.itemName)
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





		$http.get('http://www.zaitoon.online/services/fetchdeals.php?id=0')
	  .then(function(response) {
			$scope.deals = response.data.response;
			$scope.isEmpty = !response.data.status;

	    $scope.left = 1;
	  });


	  $scope.limiter = 5;
	  $scope.loadMore = function() {
			$http.get('http://www.zaitoon.online/services/fetchdeals.php?id='+$scope.limiter)
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
