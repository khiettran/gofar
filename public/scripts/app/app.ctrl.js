/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
    'use strict';

    // ReSharper disable once InconsistentNaming
    function appCtrl($scope, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $sessionStorage, appRoutes, apiRoutes, httpService, alertify, $translate) {
        $scope.app = { name: "GOFAR" };
        
        $scope.updateMemberInfo = function () {          
            if ($window.localStorage.memberInfo){
                $scope.memberInfo = JSON.parse($window.localStorage.memberInfo);
                $scope.memberInfo.isLogedIn = true;
                $scope.memberInfo.displayName = ($scope.memberInfo.AccountProfile && $scope.memberInfo.AccountProfile.Username)
                    ? $scope.memberInfo.AccountProfile.Username : $scope.memberInfo.Email;
            } else {
                $scope.memberInfo = { isLogedIn: false };
            }
        }
      
        $scope.updateMemberInfo();
        // Sign out
        $scope.signOut = function () {
            var params = {};
            httpService.sendPost(apiRoutes.memberLogout, params).then(function (response) {
                if (response && response.Success === true) {
                    delete $window.localStorage.token;
                    delete $window.localStorage.memberInfo;
                    $scope.memberInfo = { isLogedIn: false };                    
                } else {
                    alert(response.Message);
                }
            });
        }

        $scope.isContentLoading = false;
        $scope.setContentLoading = function (value) {
            $scope.isContentLoading = value;
        }

        ///FACEBOOK
        // This is called with the results from from FB.getLoginStatus().
        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                registerAccount();
            } else if (response.status === 'not_authorized') {                
                alertify.logPosition("top right").error("'Đăng nhập facebook thất bại.");
            } else {

            }
        }

        // This function is called when someone finishes with the Login
        // Button.  See the onlogin handler attached to it in the sample
        // code below.
        $scope.checkLoginState = function () {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }

        $window.fbAsyncInit = function () {            
            if (!$scope.memberInfo || !$scope.memberInfo.Id) {                
                FB.init({
                    appId: 585583858220085,
                    cookie: true,  // enable cookies to allow the server to access
                    // the session
                    xfbml: true,  // parse social plugins on this page
                    version: 'v2.5' // use graph api version 2.5
                });

                // Now that we've initialized the JavaScript SDK, we call
                // FB.getLoginStatus().  This function gets the state of the
                // person visiting this page and can return one of three states to
                // the callback you provide.  They can be:
                //
                // 1. Logged into your app ('connected')
                // 2. Logged into Facebook, but not your app ('not_authorized')
                // 3. Not logged into Facebook and can't tell if they are logged into
                //    your app or not.
                //
                // These three cases are handled in the callback function.

                FB.getLoginStatus(function (response) {
                    statusChangeCallback(response);
                });

                FB.Event.subscribe('auth.authResponseChange', function (response) {
                    statusChangeCallback(response);
                });
            }
        };

        // Here we run a very simple test of the Graph API after login is
        // successful.  See statusChangeCallback() for when this call is made.
        function registerAccount() {          
            FB.api('/me', function (response) {                
                var data = { FacebookId: response.id, AccountProfile: { Username: response.name, FullName: response.name } };
                httpService.sendPost(apiRoutes.memberSignUpFB, data).then(function (svresponse) {
                    if (svresponse && svresponse.Success === true) {
                        $window.localStorage.setItem("token", svresponse.Data.SessionToken);
                        $window.localStorage.setItem("memberInfo", JSON.stringify(svresponse.Data));
                        $scope.updateMemberInfo();                       
                    } else {
                        alertify.logPosition("top right").error(svresponse.Message);
                    }
                });                
            });
        }
        ///END FACEBOOK
    }

    angular
      .module('app')
      .controller('AppCtrl', appCtrl);

    appCtrl.$inject = ['$scope', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$sessionStorage'
        , 'APP_ROUTES'
        , 'API_ROUTES'
        , 'HttpService'
        , 'alertify'
        , '$translate'];
})();
