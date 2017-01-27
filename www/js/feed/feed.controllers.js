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

.controller('FoodArabianCtrl', function($scope, $rootScope, $http, FoodArabianService, products, ShoppingCartService, $ionicLoading, $ionicPopup) {
	
	$rootScope.isFilter = false;
	//Is Filter Applied?
	$rootScope.$on('filter_applied', function(event, filter) {
		$rootScope.isFilter = true;
		console.log('-----------');
    	console.log(filter);
  	});

  	$rootScope.clearFilter = function(){
		$rootScope.isFilter = false;
		//$rootScope.$broadcast('filter_applied','');
	}

	$http.get('http://localhost/vega-web-app/online/fetchmenu.php')
	.then(function(response){
      	$scope.menu = response.data;
    });

	$scope.search = { query : '' };
	$scope.showSearch = false;


	//Any filter applied?
	$scope.filterFlag = false;

	$scope.resetSearch = function(){
		$scope.search = { query : '' };
		$scope.showSearch = !$scope.showSearch;
	}


	$scope.cs = 'AM HERE';

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

.controller('FoodChineseCtrl', function($scope, products, ShoppingCartService, $ionicLoading) {
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

.controller('FoodIndianCtrl', function($scope, products, ShoppingCartService, $ionicLoading) {
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

.controller('FoodDessertCtrl', function($scope, products, ShoppingCartService, $ionicLoading) {
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









.controller('TravelCtrl', function($scope, products) {
	$scope.products = products;
})

.controller('DealsCtrl', function($scope, $http) { 
	
	$http.get('http://localhost/vega-web-app/online/fetchdeals.php')
	.then(function(response){
      	$scope.deals = response.data;
    });

})

.controller('RealStateCtrl', function($scope, products) {
	$scope.products = products;
})

;
