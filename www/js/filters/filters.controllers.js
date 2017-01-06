angular.module('zaitoonFirst.filters.controllers', [])

.controller('FiltersCtrl', function($scope, $state, $rootScope, $ionicSlideBoxDelegate) {

	//For Non Veg Content
	$scope.nonvegUser = true;

	//For VEG or NON-VEG

	$scope.category_filter = '';

	$scope.clearFlag = false; 	
	$scope.clearVegFlag	= false;
	$scope.clearNonVegFlag	= false;

	$scope.typeSelected = function(){
		$scope.clearFlag = true;
		if($scope.category_filter == 'VEG'){
			$scope.clearVegFlag	= true;
			$scope.clearNonVegFlag	= false;

			//reset Non Veg Filters
			this.clearNonFilter();
		}
		else{
			$scope.clearNonVegFlag	= true;
			$scope.clearVegFlag	= false;

			this.setNonFilter();
		}

	}
	
	$scope.resetVegNonVeg = function(){
		$scope.clearFlag = false;
		$scope.clearVegFlag	= false;
		$scope.clearNonVegFlag	= false;
		$scope.category_filter = '';

		this.setNonFilter();
	}

	$scope.clearNonFilter = function(){
		$scope.nonvegUser = false;
		$scope.nonvegcontent_filter.chicken = false;
		$scope.nonvegcontent_filter.mutton = false;
		$scope.nonvegcontent_filter.fish = false;
		$scope.nonvegcontent_filter.prawns = false;
		$scope.nonvegcontent_filter.egg = false;
	}

	$scope.setNonFilter = function(){
		$scope.nonvegUser = true;
	}


	//NonVeg Contents.
	$scope.nonvegcontent_filter = {};
	$scope.nonvegcontent_filter.chicken = false;
	$scope.nonvegcontent_filter.mutton = false;
	$scope.nonvegcontent_filter.fish = false;
	$scope.nonvegcontent_filter.prawns = false;
	$scope.nonvegcontent_filter.egg = false;



	//Cooking Type
	$scope.type_filter = {};
	$scope.type_filter.gravy = false;
	$scope.type_filter.semi = false;
	$scope.type_filter.dry = false;
	$scope.type_filter.deep = false;


	//Spice Level
	$scope.spice_filter = {};
	$scope.spice_filter = 'any';


	//Bone Type
	$scope.bone_filter = {};
	$scope.bone_filter = 'any';
	





	$scope.cancelRefine = function(){
		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
	};

	$scope.applyRefine = function(){
		//Create the Filter Object

		var previous_view = _.last($rootScope.previousView);
		$state.go(previous_view.fromState, previous_view.fromParams );
	};




	$scope.lockSlide = function () {
    	$ionicSlideBoxDelegate.$getByHandle('filter-tabs-slider').enableSlide(false);
  	};
})

;
