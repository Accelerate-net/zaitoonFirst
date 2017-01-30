angular.module('zaitoonFirst.feed.services', [])

.service('OutletService', function ($http, $q){
  this.getOutlet = function(code){
    var dfd = $q.defer();
    $http.get('http://localhost/vega-web-app/online/fetchoutlets.php?id='+code).success(function(data) {
      dfd.resolve(data);      
    });
    return dfd.promise;
  };
})

;
