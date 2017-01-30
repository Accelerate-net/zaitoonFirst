// This is cleaned up. Documentation pending.

angular.module('zaitoonFirst.account.services', [])

.service('ProfileService', function ($http, $q){
  this.getUserData = function(){
    var dfd = $q.defer();
    $http.get('http://localhost/vega-web-app/online/fetchusers.php').success(function(data) {
      if(data.savedAddresses == null)
        data.savedAddresses=[];
      dfd.resolve(data);
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
