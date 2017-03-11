/**
 * @ngdoc overview
 * @name Login controller
 * @description Login controller, control the user's behavie on login screen and call service to process for each behavie
 *
 */
(function() {
// ReSharper disable once InconsistentNaming
    function contactController($scope, $location, $window, ngMap, httpService) {
        // Declare variable
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB2xONcCM5lw4HqsC8tjztvHzkI8IBTU_4";
        $scope.user = {};

        // Private function
        function doSignIn() {
            
        }

        $scope.signInokFree = function () {
            if (isEmpty($scope.user.email) || isEmpty($scope.user.password)){
                alert($scope.user.email + " " + $scope.user.password);
                return;
            }
            if ($scope.user.password.length < 6) {
                alert("a");
                return;
            }

            doSignIn();
        };        
    }
   
    angular.module('app').controller('ContactController', ['$scope', '$location', '$window', 'NgMap', 'HttpService', contactController]);
})();
