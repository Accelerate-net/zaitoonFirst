angular.module('zaitoonFirst.content.services', [])

.service('OutletService', function ($http, $q){
  this.getOutlet = function(code){
    var dfd = $q.defer();
    $http.get('https://www.zaitoon.online/services/fetchoutlets.php?outletcode='+code).success(function(data) {
      dfd.resolve(data.response);
    });
    return dfd.promise;
  };
})

;
