/**
 * @ngdoc overview
 * @name Login controller
 * @description Login controller, control the user's behavie on login screen and call service to process for each behavie
 *
 */
(function() {
// ReSharper disable once InconsistentNaming
    function signInController($scope, $location, $window, httpService, alertify, apiRoutes, appRoutes) {
        // Declare variable
        $scope.user = {Email: "", Password: ""};
        if ($window.localStorage.memberInfo) {
            $location.path(appRoutes.homePage)
        }
        // Private function
        function doSignIn() {
            httpService.sendPost(apiRoutes.memberLogin, $scope.user, $scope.setContentLoading).then(function (response) {
                if (response && response.Success === true) {
                    $window.localStorage.setItem("token", response.Data.SessionToken);
                    $window.localStorage.setItem("memberInfo", JSON.stringify(response.Data));
                    $scope.updateMemberInfo();
                    $location.path(appRoutes.homePage);
                }
            });
        }

        $scope.signIn = function () {
            if (isEmpty($scope.user.Email) || isEmpty($scope.user.Password)){
                alertify.logPosition("top right").error("Bạn chưa nhập thông tin đăng nhập");
                return;
            }
            if ($scope.user.Password.length < 6 || $scope.user.Password.length > 64) {
                alertify.logPosition("top right").error("Mật khậu phải từ 6-64 ký tự");
                return;
            }

            doSignIn();
        };        
    }
   
    angular.module('app').controller('SignInController', ['$scope', '$location', '$window', 'HttpService', 'alertify', 'API_ROUTES', 'APP_ROUTES', signInController]);
})();
