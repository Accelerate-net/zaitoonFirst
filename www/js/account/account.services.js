// This is cleaned up. Documentation pending.

angular.module('zaitoonFirst.account.services', [])

.service('ProfileService', function ($http, $q){
  this.getUserData = function(){
    var dfd = $q.defer();

    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;

    $http({
      method  : 'POST',
      url     : 'http://localhost/vega-web-app/online/fetchusers.php',
      data    : data, //forms user object
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(respose) {
        if(respose.data.savedAddresses == null)
          respose.data.savedAddresses=[];
        dfd.resolve(respose.data);
    });

    return dfd.promise;
  };


  this.updateUserData = function(newName, newEmail){
        var data = {};
        data.token = JSON.parse(window.localStorage.user).token;
        data.email = newEmail;
        data.name = newName;

        $http({
          method  : 'POST',
          url     : 'http://localhost/vega-web-app/online/edituser.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(respose) {
        });
  };

  //Delete a saved Address.
  this.deleteSavedAddress = function(id){
    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;
    data.id = id;

    $http({
      method  : 'POST',
      url     : 'http://localhost/vega-web-app/online/deletesavedaddress.php',
      data    : data, //forms user object
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(respose) {
    });

    return true;
  };


})



.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){

          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });

          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });

        }
        else {

          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);

          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);
        }
    }
  }
})


;
