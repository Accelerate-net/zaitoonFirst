angular.module('zaitoonFirst.auth.controllers', [])

.controller('LoginCtrl', function(ConnectivityMonitor, $scope, $state, $http, $ionicLoading, $timeout) {
	//If already logged in?
	if(!_.isUndefined(window.localStorage.user)){
		$state.go('main.app.feed.arabian');
	}

	//Network Status
	if(ConnectivityMonitor.isOffline()){
		$scope.isOfflineFlag = true;
	}
	else{
		$scope.isOfflineFlag = false;
	}
	

	$scope.user = {};

	$scope.user.email = "";
	$scope.user.otp = "";
	$scope.user.mobile = "";
	$scope.otpFlag = false;

	//Global across login process
	$scope.main = "";
	$scope.main.isOTPSent = false;

	$scope.resetNumber = function(){
		$scope.otpFlag = false;
	}

	$scope.validateNumber = function(){

		var isnum = /^\d+$/.test($scope.user.mobile);
		if(isnum && $scope.user.mobile.length == 10){

			var data = {};
			data.mobile = $scope.user.mobile;

			$http({
				method  : 'POST',
				url     : 'http://www.zaitoon.online/services/userlogin.php',
				data    : data, //forms user object
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			 })
			.then(function(response) {
				$scope.main = response.data.response;
				if($scope.main.isOTPSent){
					$scope.otpFlag = true;
					$scope.error="";
				}else{
					$scope.error = "Number not registered.";
				}
			});


		}
		else
		{
			$scope.error = "Invalid Mobile Number";
		}

	};

	$scope.doLogIn = function(){

		$scope.error="";

		var isnum = /^\d+$/.test($scope.user.otp);
		if(isnum && $scope.user.otp.length == 4){

			var sdata = {};
			sdata.mobile = $scope.user.mobile;
			sdata.otp = $scope.user.otp;

			$http({
				method  : 'POST',
				url     : 'http://www.zaitoon.online/services/validatelogin.php',
				data    : sdata, //forms user object
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			 })
			.then(function(response) {
				$scope.validated = response.data;

				if($scope.validated.status){ //Validate OTP and LOG IN
					$scope.error="";
					//Set User Credentials
					window.localStorage.user = JSON.stringify($scope.validated.response);

					$state.go('main.app.feed.arabian');
				}else{
					console.log('ERROR');
					$scope.error = $scope.validated.error;
				}

			});
		}
		else
		{
			$scope.error = "OTP must be a 4 digit number.";
		}

	};


})

.controller('SignupCtrl', function($scope, $http, $state, $ionicLoading, $timeout, $ionicModal) {
	$scope.user = {};

	$scope.user.name = "";
	$scope.user.email = "";
	$scope.user.mobile = "";
	$scope.signupFlag = false;

	$scope.validateSignUp = function(){
		//Validate, Create an account and login.
		var isnum = /^\d+$/.test($scope.user.mobile);
		var ischar = /^[a-zA-Z ]*$/.test($scope.user.name);
		var isemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.user.email);
		if(ischar && $scope.user.name.length >=5){
			if(isnum && $scope.user.mobile.length ==10){ //Validate OTP and LOG IN
				if(isemail){ //Validate OTP and SIGN UP
					$scope.error="";

					var data = {};
					data.mobile = $scope.user.mobile;

					$http({
						method  : 'POST',
						url     : 'http://www.zaitoon.online/services/usersignup.php',
						data    : data, //forms user object
						headers : {'Content-Type': 'application/x-www-form-urlencoded'}
					 })
					.then(function(response) {
						$scope.main = response.data.response;
						console.log($scope.main)
						if($scope.main.isOTPSent){
							$scope.signupFlag = true;
							$scope.error="";
							$scope.otpapi = $scope.main.otp;
						}else{
							$scope.error = response.data.error;
						}
					});


				}else{
					$scope.error = "Enter a valid email.";
				}
			}else{
				$scope.error = "Enter a valid moile number.";
			}

		}
		else
		{
			$scope.error = "Name must be atleast 5 characters.";
		}

	};

	$scope.doSignUp = function(){
		var isnum = /^\d+$/.test($scope.user.otp);
		if(isnum && $scope.user.otp.length == 4){
			var data = {};
			data.mobile = $scope.user.mobile;
			data.name = $scope.user.name;
			data.email = $scope.user.email;
			data.otpapi = $scope.otpapi;
			data.otpuser = $scope.user.otp;

			$http({
				method  : 'POST',
				url     : 'http://www.zaitoon.online/services/validatesignup.php',
				data    : data, //forms user object
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			 })
			.then(function(response) {
				$scope.main = response.data.response;
				if(response.data.status){
					//Set User info
					window.localStorage.user = JSON.stringify(response.data.response);
					$state.go('main.app.feed.arabian');
				}else{
					$scope.error = response.data.error;
				}
			});

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
