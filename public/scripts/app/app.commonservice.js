/**
 * @ngdoc function
 * @name app.commonservice
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function () {
    'use strict';

    // ================ Common Service ================
    angular.module('app').factory("commonService", function () {
            var commonService = {};

            // Show/hide page at pagination
            commonService.showPage = function (flag, currentPage, totalPage) {
                var result = false;
                if (flag === 'first')
                    result = currentPage > 1;
                else if (flag === 'pre')
                    result = ((currentPage >= 2 && totalPage > 2 && currentPage - 1 > 1));
                else if (flag === 'moreleft')
                    result = (currentPage > 3);
                else if (flag === 'nxt')
                    result = ((currentPage < totalPage - 1 && totalPage > 2));
                else if (flag === 'moreright')
                    result = (currentPage < totalPage - 2 && totalPage > 3);
                else if (flag === 'last')
                    result = currentPage < totalPage;
                return result;
            }
            // Disable button prev/next at pagination
            commonService.disableButton = function (flag, currentPage, totalPage) {
                if (flag === 'pre' && currentPage <= 1) {
                    return true;
                } else if (flag === 'nxt' && currentPage >= totalPage) {
                    return true;
                }
                return false;
            }

            commonService.preparePagination = function (data) {
                return {
                    totalItems: data.Data.TotalItemCount,
                    currentPage: data.Data.PageNumber,
                    totalPage: data.Data.PageCount,
                    pageSize: data.Data.PageSize,
                    currentItem: (data.Data.PageSize * (data.Data.PageNumber - 1)) + '-' + (data.Data.PageSize * (data.Data.PageNumber - 1)) + data.Data.Items.length
                }
            }

            commonService.cloneArray = function (array) {
                var result = [];
                for (var i = 0; i < array.length; i++) {
                    var temp = $.extend(true, {}, array[i]);
                    result.push(temp);
                }
                return result;
            }

            commonService.datetimePicker = function ($scope) {
                $scope.today = function () {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                };

                // Disable weekend selection
                $scope.disabled = function (date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
                };

                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    class: 'datepicker'
                };

                $scope.initDate = new Date();
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];
                $scope.icons = {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-screenshot',
                    clear: 'fa fa-trash',
                    close: 'fa fa-remove'
                };
            }

            commonService.openModal = function (url, controller, params, delegateFunction) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: url,
                    controller: controller,
                    backdrop: 'static',
                    resolve: {
                        params: params
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result === "success") {
                        delegateFunction();
                    }
                });
            }

            return commonService;
        }
    );
})();
