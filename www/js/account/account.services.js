// This is cleaned up. Documentation pending.

angular.module('zaitoonFirst.account.services', [])

.service('ProfileService', function ($http, $q){
  this.getUserData = function(){
    var dfd = $q.defer();

    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;

    $http({
      method  : 'POST',
      url     : 'http://www.zaitoon.online/services/fetchusers.php',
      data    : data, //forms user object
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(response) {
        if(response.data.savedAddresses == null)
          response.data.savedAddresses=[];

          //Update the Offline Cache
          var temp = {};
          temp = response.data;
          temp.token = JSON.parse(window.localStorage.user).token;
          window.localStorage.user = JSON.stringify(temp);

        dfd.resolve(response.data);
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
          url     : 'http://www.zaitoon.online/services/edituser.php',
          data    : data, //forms user object
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
        .then(function(response) {
          //Update the Offline Cache
          var temp = {};
          temp = JSON.parse(window.localStorage.user);
          temp.name = data.name;
          temp.email = data.email;
          window.localStorage.user = JSON.stringify(temp);
        });
  };

  //Delete a saved Address.
  this.deleteSavedAddress = function(id){
    var data = {};
    data.token = JSON.parse(window.localStorage.user).token;
    data.id = id;

    $http({
      method  : 'POST',
      url     : 'http://www.zaitoon.online/services/deletesavedaddress.php',
      data    : data, //forms user object
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
    .then(function(response) {
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
