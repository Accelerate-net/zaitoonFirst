angular.module('zaitoonFirst.feed.controllers', [])


.controller('FeedCtrl', function($scope,  $ionicScrollDelegate, ShoppingCartService) {
	$scope.getProductsInCart = function(){
		return ShoppingCartService.getProducts().length;
	};
})

.controller('FashionCtrl', function($scope, $stateParams, products) {
	$scope.filters = $stateParams.filters;

	$scope.products = products;
})

.controller('FoodCtrl', function($scope, products, ShoppingCartService, $ionicLoading) {
		
		$scope.products = products;

		$scope.addToCart = function(product) {
		$ionicLoading.show({
			template: 'Adding to Cartsss',
			duration: 1000
		});

		product.qty = 1;
		product.size = "M";
		product.color = "black";
		product.price = 120;
  	    ShoppingCartService.addProduct(product);
  	    console.log(product);
  		};




})

.controller('FoodSoupCtrl', function($scope, products, ShoppingCartService, $ionicLoading) {
	$scope.products = products;

	$scope.addToCart = function(product) {
		$ionicLoading.show({
			template:  '<b style="color: #f1c40f">'+product.name+'</b> is added.',
			duration: 1000
		});

		product.qty = 1;
		product.size = "M";
		product.color = "black";
		product.price = 150;
  	    ShoppingCartService.addProduct(product);
  	    //console.log(product);
  };


})

.controller('FoodArabianCtrl', function($scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {
	
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
        	console.log(data.filter);   	
    	}

        $http({
          method  : 'POST',
          url     : 'http://localhost/vega-web-app/online/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
        .then(function(response) {
			$scope.menu = response.data;    
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

.controller('FoodChineseCtrl', function($scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {
	
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
        	console.log(data.filter);   	
    	}

        $http({
          method  : 'POST',
          url     : 'http://localhost/vega-web-app/online/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
        .then(function(response) {
			$scope.menu = response.data;    
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


.controller('FoodIndianCtrl', function($scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {
	
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
        	console.log(data.filter);   	
    	}

        $http({
          method  : 'POST',
          url     : 'http://localhost/vega-web-app/online/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
        .then(function(response) {
			$scope.menu = response.data;    
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

.controller('FoodDessertCtrl', function($scope, $rootScope, $http, ShoppingCartService, $ionicLoading, $ionicPopup) {
	
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
        	console.log(data.filter);   	
    	}

        $http({
          method  : 'POST',
          url     : 'http://localhost/vega-web-app/online/fetchmenu.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
         })
        .then(function(response) {
			$scope.menu = response.data;    
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








.controller('TravelCtrl', function($scope, products) {
	$scope.products = products;
})

.controller('DealsCtrl', function($scope, $http, $ionicPopup, $state, OutletService) { 

	//Book a Table
	$scope.showOutlets = function(){

		//Get all the outlets
		$http.get('http://localhost/vega-web-app/online/fetchoutlets.php')
		.then(function(response){
	      	$scope.allList = response.data;
	      	console.log($scope.allList);
	    });

		outletsPopup = $ionicPopup.show({
			cssClass: 'popup-outer edit-shipping-address-view',
			templateUrl: 'views/content/food/outlets.html',
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

	
	$http.get('http://localhost/vega-web-app/online/fetchdeals.php')
	.then(function(response){
      	$scope.deals = response.data;
    });

})

.controller('RealStateCtrl', function($scope, products) {
	$scope.products = products;
})

;
