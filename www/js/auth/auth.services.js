angular.module('zaitoonFirst.auth.services', [])

.service('AuthService', function (){
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
  var isOpen = true;

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
    isOpen = info.isOpen;
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
      "isOpen": isOpen,
      "paymentKey": paymentKey
    }
    return data;
  }

})


;
