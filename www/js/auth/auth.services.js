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

  //Default Parameters
  var outlet = "";
  var paymentKey = "";
  var onlyTakeAway = false;
  var isSpecial = false;
  var city = "";
  var location = "";
  var locationCode = "";

  var isAcceptingOnlinePayment = true;

  var isTaxCollected = true;
  var taxPercentage = 0.02;

  var isParcelCollected = true;
  var parcelPercentageDelivery = 0.05;
  var parcelPercentagePickup = 0.03;

  var minAmount = 300;
  var minTime = 45;

  this.setOutletInfo = function(info){
    outlet = info.outlet;
    onlyTakeAway = info.onlyTakeAway;
    isSpecial = info.isSpecial;
    city = info.city;
    location = info.location;
    locationCode = info.locationCode;
    isAcceptingOnlinePayment = info.isAcceptingOnlinePayment;
    paymentKey = info.paymentKey;
    isTaxCollected = info.isTaxCollected;
    taxPercentage = info.taxPercentage;
    isParcelCollected = info.isParcelCollected;
    parcelPercentageDelivery = info.parcelPercentageDelivery;
    parcelPercentagePickup = info.parcelPercentagePickup;
    minAmount = info.minAmount;
    minTime = info.minTime;
  }

  this.getInfo = function(){
    var data = {
      "outlet":outlet,
      "onlyTakeAway":onlyTakeAway,
      "isSpecial": isSpecial,
      "city":city,
      "location":location,
      "locationCode":locationCode,
      "isTaxCollected": isTaxCollected,
      "taxPercentage": taxPercentage,
      "isParcelCollected":isParcelCollected,
      "parcelPercentageDelivery": parcelPercentageDelivery,
      "parcelPercentagePickup": parcelPercentagePickup,
      "minTime": minTime,
      "minAmount": minAmount,
      "isAcceptingOnlinePayment": isAcceptingOnlinePayment,
      "paymentKey": paymentKey
    }
    return data;
  }

})


;
