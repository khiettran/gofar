/**
 * @ngdoc overview
 * @name app
 * @description: Recieve user's request from controller,
 * Access service. All request about login, logout
 */
(function() {
    // ReSharper disable once InconsistentNaming
    function accessService($http, API_ROUTES) {
        var service = {};        
        service.signIn = function (params) {
            return $http({
                method: 'POST',
                url: ApiRootURL + API_ROUTES.memberLogin,
                data: params
            }).then(function (response) {
                return response.data;
            }).catch(function (data) {                
                return { Message: data.statusText };
            });
        }

        service.signOut = function(params) {
            return $http({
                method: 'POST',
                url: ApiRootURL + API_ROUTES.memberLogout,
                data: params
            }).then(function (response) {
                return response.data;
            }).catch(function (data) {
                return { Message: data.statusText };
            });
        }

        return service;
    }

    angular.module('app').factory('AccessService', ['$http', 'API_ROUTES',  accessService]);
})();
