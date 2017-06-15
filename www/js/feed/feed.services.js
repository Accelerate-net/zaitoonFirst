angular.module('zaitoonFirst.feed.services', [])


.service('menuService', function ($http, $q){

  //Default Parameters
  var displayMenuType = "ARABIAN";

  var isArabianLoaded = false;
  var isChineseLoaded = false;
  var isIndianLoaded = false;
  var isDessertLoaded = false;

  this.setDisplayMenuType = function(menutype){
    displayMenuType = menutype;
  }

  this.resetAll = function(){
     isArabianLoaded = false;
     isChineseLoaded = false;
     isIndianLoaded = false;
     isDessertLoaded = false;
  }

  this.setLoadFlag = function(type, flag){
    if(type == 'ARABIAN'){
      isArabianLoaded = flag;
    }
    else if(type == 'CHINESE'){
      isChineseLoaded = flag;
    }
    else if(type == 'INDIAN'){
      isIndianLoaded = flag;
    }
    else if(type == 'DESSERT'){
      isDessertLoaded = flag;
    }
  }

  this.getDisplayMenuType = function(){
    return type;
  }

  this.getIsLoadedFlag = function(menutype){
    if(menutype == 'ARABIAN'){
      return isArabianLoaded;
    }
    else if(menutype == 'CHINESE'){
      return isChineseLoaded;
    }
    else if(menutype == 'INDIAN'){
      return isIndianLoaded;
    }
    else if(menutype == 'DESSERT'){
      return isDessertLoaded;
    }
  }

})

;
