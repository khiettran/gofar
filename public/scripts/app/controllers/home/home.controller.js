/**
 * @ngdoc overview
 * @name Member controller
 * @description
 *
 */
(function () {
    function homeController($scope, $state, $localStorage, $stateParams, httpService, ngMap, commonService, apiRoutes, tourCategories) {
        commonService.datetimePicker($scope);
        $scope.commonService = commonService;
        $scope.tourCategories = tourCategories;
        $scope.filter = {categoryId: $stateParams.categoryId};
        $scope.recentViewedTours = $localStorage.recentViewedTours ? $localStorage.recentViewedTours : [];
        var viewedTourLength = 10;
        // Declare variable        
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB2xONcCM5lw4HqsC8tjztvHzkI8IBTU_4";
        $scope.isHideSearchResult = true;

        $scope.filterTour = function () {
            $scope.isHideSearchResult = false;
            httpService.sendGet(apiRoutes.tourFilter, $scope.filter, $scope.setContentLoading).then(function (response) {
                if (response && response.Success === true) {
                    $scope.tours = response.Data ? response.Data.Items : [];
                    $scope.paging = commonService.preparePagination(response);
                }
            });
        }

        if ($scope.filter.categoryId > 0)
            $scope.filterTour();

        function addTourRecent(tour) {
            if ($scope.recentViewedTours) {
                var isExisted = false;
                for (var i = 0; i < $scope.recentViewedTours.length; i++) {
                    if ($scope.recentViewedTours[i].Id == tour.Id) {
                        isExisted = true;
                        break;
                    }
                }
                if (!isExisted) {
                    if ($scope.recentViewedTours.length >= viewedTourLength)
                        $scope.recentViewedTours.shift($scope.recentViewedTours[viewedTourLength - 1]);
                    $scope.recentViewedTours.unshift(tour);
                }
            } else {
                $scope.recentViewedTours = [];
                $scope.recentViewedTours.unshift(tour);
            }
            $localStorage.recentViewedTours = $scope.recentViewedTours;
        }

        function filterHotTrip() {
            let hotTripFilter = {PageSize: 10};
            httpService.sendGet(apiRoutes.tourFilter, hotTripFilter, $scope.setContentLoading).then(function (response) {
                $scope.hotTours = response ? response : [];
            });
        }

        filterHotTrip();

        $scope.addRecentViewedTour = function (tour) {
            addTourRecent(tour);

            $state.go('app.tour', {tourId: tour.Id});
        }

        $scope.bookNowClick = function (tour) {
            addTourRecent(tour);

            $state.go('app.payment.cart', {tourId: tour.Id});

        }

        function filterPromotionTour() {
            var promotionFilter = {};
            httpService.sendGet(apiRoutes.tourFilter, promotionFilter, $scope.setContentLoading).then(function (response) {
                if (response && response.Success === true) {
                    $scope.promotionTours = response.Data ? response.Data.Items : [];
                }
            });
        }

        $scope.loadMore = function (flag, pageNumber) {
            if (flag === 'pre') {
                if ($scope.paging.currentPage - 1 > 0)
                    $scope.paging.currentPage -= 1;
            } else if (flag === 'nxt') {
                if ($scope.paging.currentPage + 1 <= $scope.paging.totalPage)
                    $scope.paging.currentPage += 1;
            } else {
                $scope.paging.currentPage = pageNumber;
            }
            $scope.filter.pageNumber = $scope.paging.currentPage;
            $scope.filterTour();
        };
    }

    angular.module('app').controller('HomeController', ['$scope', '$state', '$localStorage', '$stateParams', 'HttpService', 'NgMap', 'commonService', 'API_ROUTES', 'TOUR_CATEGORIES', homeController]);
})();