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

;
