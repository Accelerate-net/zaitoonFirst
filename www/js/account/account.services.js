// This is cleaned up. Documentation pending.

angular.module('zaitoonFirst.account.services', [])

.service('ProfileService', function ($http, $q){
  this.getUserData = function(){
    var dfd = $q.defer();

    var data = {};
    data.mobile = "9043960876";

    $http({
      method  : 'POST',
      url     : 'http://www.zaitoon.online/services/fetchusers.php',
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
    $http.get('http://localhost/vega-web-app/online/updateuser.php?name='+newName+'&email='+newEmail+'&id=9043960876').success(function(response) {

    });
  };

  //Delete a saved Address.
  this.deleteSavedAddress = function(id){
    $http.get('http://localhost/vega-web-app/online/deletesavedaddress.php?id='+id+'&user=9043960876').success(function(response) {

    });
    return true;
  };


})

;
