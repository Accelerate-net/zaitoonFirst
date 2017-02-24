angular.module('zaitoonFirst.auth.services', [])

.service('AuthService', function ($http, $q){

  this.getLoggedUser = function(){
    var dfd = $q.defer();
    $http.get('logged_user_db.json').success(function(database) {
      dfd.resolve(database.user);
    });
    return dfd.promise;
  };
})

.service('outletService', function ($http, $q){

  var outlet = "VELACHERY";
  var city = "CHENNAI";
  var location = "Vijaya Nagar Bus Stand";

  var isTaxCollected = true;
  var taxPercentage = 0.02;

  var isParcelCollected = true;
  var parcelPercentageDelivery = 0.05;
  var parcelPercentagePickup = 0.03;

  var minAmount = 300;
  var minTime = 60;

  this.getInfo = function(){
    var data = {
      "outlet":outlet,
      "city":city,
      "location":location,
      "isTaxCollected": isTaxCollected,
      "taxPercentage": taxPercentage,
      "isParcelCollected":isParcelCollected,
      "parcelPercentageDelivery": parcelPercentageDelivery,
      "parcelPercentagePickup": parcelPercentagePickup,
      "minTime": minTime,
      "minAmount": minAmount
    }
    return data;
  }

})


;
