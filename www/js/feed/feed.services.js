angular.module('zaitoonFirst.feed.services', [])

.service('FashionService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('fashion_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    var service = this;

    $http.get('fashion_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });

      service.getRelatedProducts(product).then(function(related_products){
        product.related_products = related_products;
      }, function(error){
        console.log("ups", error);
      });

      dfd.resolve(product);
    });
    return dfd.promise;
  };

  this.getRelatedProducts = function(product){
    var dfd = $q.defer();

    $http.get('fashion_db.json').success(function(database) {
      //add product data to this order
      var related_products = _.map(product.related_products, function(product){
        return _.find(database.products, function(p){ return p.id == product.id; });
      });
      dfd.resolve(related_products);
    });

    return dfd.promise;
  };
})

.service('FoodService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})

.service('FoodSoupService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_soup_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_soup_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})


.service('FoodArabianService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_arabian_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_arabian_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})


.service('FoodIndianService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_indian_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_indian_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})


.service('FoodChineseService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_chinese_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_chinese_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})


.service('FoodDessertService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('food_dessert_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('food_dessert_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})

.service('DealsService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('deals_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('deals_db.json').success(function(database) {
      var product = _.find(database.products, function(product){ return product.id == productId; });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})
.service('TravelService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('travel_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('travel_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})

.service('RealStateService', function ($http, $q){
  this.getProducts = function(){
    var dfd = $q.defer();
    $http.get('real_state_db.json').success(function(database) {
      dfd.resolve(database.products);
    });
    return dfd.promise;
  };

  this.getProduct = function(productId){
    var dfd = $q.defer();
    $http.get('real_state_db.json').success(function(database) {
      var product = _.find(database.products, function(product){
        return product.id == productId;
      });
      dfd.resolve(product);
    });
    return dfd.promise;
  };
})

.service('OutletService', function ($http, $q){
  this.getOutlets = function(){
    var dfd = $q.defer();
    $http.get('http://localhost/vega-web-app/online/fetchoutlets.php').success(function(data) {
      dfd.resolve(data);
    });
    return dfd.promise;
  };


  this.getOutlet = function(code){
    var dfd = $q.defer();
    $http.get('http://localhost/vega-web-app/online/fetchoutlets.php?id=VELACHERY').success(function(data) {
      dfd.resolve(data);
    });
    return dfd.promise;
  };
})

;
