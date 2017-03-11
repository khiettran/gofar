/**
 * @ngdoc overview
 * @name app
 * @description: http service,
 * Helpdesk service.
 */
(function () {    
    function httpService($http, alertify) {
        var service = {};       

        service.sendGet = function (url, params, setContentLoading) {
            if (setContentLoading)
                setContentLoading(true);

            return $http({
                method: "GET",
                url: ApiRootURL + url,
                params: params
            }).then(function (response) {
                if (response.data && !response.data.Success)
                    alertify.logPosition("top right").error(response.data.Message);

                return response.data;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
            }).finally(function () {
                if (setContentLoading)
                    setContentLoading(false);
            });;
        }

        service.sendPost = function (url, data, setContentLoading) {
            if (setContentLoading)
                setContentLoading(true);
            return $http({
                method: "POST",
                url: ApiRootURL + url,
                data: data
            }).then(function (response) {
                if (response.data && !response.data.Success)
                    alertify.logPosition("top right").error(response.data.Message);

                return response.data;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
            }).finally(function () {
                if (setContentLoading)
                    setContentLoading(false);
            });
        }

        // Http Post with media menthod
        service.sendPostMedia = function (url, requestData) {
            return $http({
                method: 'POST',
                url: ApiRootURL + url,
                headers: { 'Content-Type': undefined },
                data: requestData,
                transformRequest: function (data) {
                    var formData = undefined;

                    if (data) {
                        formData = new FormData();
                        if (data.model) { // key model
                            formData.append("model", new Blob([JSON.stringify(data.model)], { type: "application/json" }));
                        }

                        if (data.files) { // key files
                            if (angular.isArray(data.files)) {
                                for (var i = 0; i < data.files.length; i++) {
                                    formData.append(name, data.files[i]);
                                }
                            } else {
                                formData.append(name, data.files);
                            }
                        }

                    }

                    return formData;
                }
            }).then(function (response) {
                if (!response.data.Success)
                    alertify.logPosition("top right").error(response.data.Message);
                if (response.ErrorCode === 401)
                    $location.url(appRoutes.MemberSignin);

                return response.data;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
                if (data.status === 401) {
                    delete $window.localStorage.token;
                    delete $window.localStorage.memberInfo;
                    $location.path(appRoutes.MemberSignin);
                }
            });
        }

        service.sendGetPaypal = function (url, params) {

        }

        service.sendRedirectPaypal = function (url, params) {
            return $http({
                method: "REDIRECT",
                url: url
            }).then(function (response) {
                return response;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
            });
        }

        service.sendPostPaypal = function (url, data, accessToken) {
            return $http({
                method: "POST",
                url: url,
                headers: {"Authorization": accessToken},
                data: data
            }).then(function (response) {
                return response;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
            });
        }

        service.sendPostPaypal1 = function (url, accessToken) {
            return $http({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": accessToken,
                    "Content-Type": "application/json"
                },
                data: ''
            }).then(function (response) {
                return response;
            }).catch(function (data) {
                alertify.logPosition("top right").error(data.statusText);
            });
        }

        return service;
    }

    angular.module('app').factory('HttpService', ['$http', 'alertify', httpService]);
})();
