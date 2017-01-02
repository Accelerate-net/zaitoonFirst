angular.module('zaitoonFirst.auth.controllers', [])

.controller('LoginCtrl', function($scope, $state, $ionicLoading, $timeout) {
	$scope.user = {};

	$scope.user.email = "";
	$scope.user.otp = "";
	$scope.user.mobile = "";
	$scope.otpFlag = false;

	

	$scope.validateNumber = function(){

		var isnum = /^\d+$/.test($scope.user.mobile);
		if(isnum && $scope.user.mobile.length == 10){
			if($scope.user.mobile == "9043960876"){
				$scope.otpFlag = true;
				$scope.error="";
			}else{
				$scope.error = "Number not registered.";
			}
		}
		else
		{
			$scope.error = "Invalid Mobile Number";
		}

		$ionicLoading.show({
      		template: 'Loading...'
    	});

		$timeout(function(){			
			$ionicLoading.hide();
		}, 800);
	};

	$scope.doLogIn = function(){

		var isnum = /^\d+$/.test($scope.user.otp);
		if(isnum && $scope.user.otp.length == 4){
			if($scope.user.otp == "1111"){ //Validate OTP and LOG IN				
				$state.go('main.app.feed.arabian');
      			$ionicLoading.hide();
				$scope.error="";
			}else{
				$scope.error = "Incorrect OTP.";
			}
		}
		else
		{
			$scope.error = "OTP must be a 4 digit number.";
		}

		$ionicLoading.show({
      		template: 'Loading...'
    	});

		$timeout(function(){			
			$ionicLoading.hide();
		}, 800);
	};

	$scope.doFacebookLogIn = function(){
		console.log("doing FACEBOOK log in");

		$ionicLoading.show({
      template: 'Loging in...'
    });

		$timeout(function(){
			// Simulate login OK
			$state.go('main.app.feed.fashion');
      		$ionicLoading.hide();

			// Simulate login ERROR
			// $scope.error = "This is an error message";
			// $ionicLoading.hide();
		}, 800);
	};
})

.controller('SignupCtrl', function($scope, $state, $ionicLoading, $timeout, $ionicModal) {
	$scope.user = {};

	$scope.user.name = "";
	$scope.user.email = "";
	$scope.user.password = "";

	$scope.doSignUp = function(){
		console.log("doing sign up");

		$ionicLoading.show({
      template: 'Creating account...'
    });

		$timeout(function(){
			// Simulate login OK
			// $state.go('main.app.feed.fashion');
      // $ionicLoading.hide();

			// Simulate login ERROR
			$scope.error = "This is an error message";
			$ionicLoading.hide();
		}, 800);
	};

	$scope.doFacebookSignUp = function(){
		console.log("doing FACEBOOK sign up");

		$ionicLoading.show({
      template: 'Creating account...'
    });

		$timeout(function(){
			// Simulate login OK
			$state.go('main.app.feed.fashion');
      $ionicLoading.hide();

			// Simulate login ERROR
			// $scope.error = "This is an error message";
			// $ionicLoading.hide();
		}, 800);
	};

	$ionicModal.fromTemplateUrl('views/legal/privacy-policy.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.privacy_policy_modal = modal;
  });

	$ionicModal.fromTemplateUrl('views/legal/terms-of-service.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_of_service_modal = modal;
  });

	$scope.showTerms = function(){
		$scope.terms_of_service_modal.show();
	};

	$scope.showPrivacyPolicy = function(){
		$scope.privacy_policy_modal.show();
	};
})

.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading, $timeout) {
	$scope.user = {};

	$scope.user.email = "";

	$scope.recoverPassword = function(){
		console.log("recover password");

		$ionicLoading.show({
      template: 'Recovering password...'
    });

		$timeout(function(){
			// Simulate login OK
			$state.go('main.app.feed.fashion');
      $ionicLoading.hide();

			// Simulate login ERROR
			// $scope.error = "This is an error message";
			// $ionicLoading.hide();
		}, 800);
	};
})


;
