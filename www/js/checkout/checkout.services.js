angular.module('zaitoonFirst.checkout.services', [])

.service('CheckoutService', function ($http, $q){

  this.getUserCreditCards = function(){
    var dfd = $q.defer();
    $http.get('logged_user_db.json').success(function(database) {
      dfd.resolve(database.user.credit_cards);
    });
    return dfd.promise;
  };

  this.getUserShippingAddresses = function(){
    var dfd = $q.defer();
    $http.get('logged_user_db.json').success(function(database) {
      dfd.resolve(database.user.shipping_addresses);
    });
    return dfd.promise;
  };

  this.saveUserSelectedCard = function(card){
    window.localStorage.zaitoonFirst_selected_card = JSON.stringify(card);
  }
  this.saveUserSelectedAddress = function(address){
    window.localStorage.zaitoonFirst_selected_address = JSON.stringify(address);
  }
  this.getUserSelectedCard = function(){
    return JSON.parse(window.localStorage.zaitoonFirst_selected_card || '[]');
  };
  this.getUserSelectedAddress = function(){
    return JSON.parse(window.localStorage.zaitoonFirst_selected_address || '[]');
  };
})

;
