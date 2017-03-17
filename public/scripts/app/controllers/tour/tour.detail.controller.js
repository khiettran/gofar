/**
 * @ngdoc overview
 * @name Member controller
 * @description
 *
 */
(function () {
    function tourDetailController($scope, $location, $stateParams, commonService, httpService, ngMap, apiRoutes, ratValues, alertify) {
        // Declare variable       

        $scope.linkShared = "";
        function buildTourSliderImage(imgs) {
            $scope.images = [];
            for (var i = 0; i < imgs.length; i++) {
                var image = {
                    src: imgs[i],
                    alt: "image " + i,
                    link: imgs[i]
                };
                $scope.images.push(image);
            }
        }

        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB2xONcCM5lw4HqsC8tjztvHzkI8IBTU_4";

        if (!$stateParams.tourId)
            alertify.logPosition("top right").error($filter('translate')('errorMessages.invalidUrl'));
        else {
            $scope.tourId = $stateParams.tourId;
            $scope.getTourDetail = function () {
                var url = apiRoutes.tourDetail.replace("{tourId}", $scope.tourId);

                httpService.sendGet(url).then(function (response) {
                    if (!response.error) {
                        $scope.tour = response[0];
                        $scope.linkShared = "http://dulich.vnexpress.net/tin-tuc/cong-dong/dau-chan/trai-long-cua-nu-phuot-thu-kho-tam-vi-xinh-dep-3494051.html";//"http://localhost:8083/app/chi-tiet/" + $scope.tour.Id;
                        buildTourSliderImage($scope.tour.PlaceImages);
                    }
                });
            }
            $scope.getTourDetail();
        }

        // VALUE OF RATING USER

        $scope.myRat = {
            Id: -1,
            Facility: 10,
            Human: 10,
            Service: 10,
            Interesting: 10,
            Average: 1,
            AverageTotal: 0,
            AccountProfileId: 27,
            TourId: $stateParams.tourId,
            CreatedBy: '',
            CreatedAt: '',
            UpdatedBy: '',
            UpdatedAt: '',
            RateName: ''
        };
        $scope.isShowMyRat = false;

        $scope.loadingMyRat = function () {
            httpService.sendGet(apiRoutes.tourRatingDetail
                .replace('{IdTour}', 1)
                .replace('{IdAccount}', 27)).then(function (response) {
                    //TODO: check response
                if (response && response.Success === true) {
                    $scope.myRat = response.Data;
                    $scope.reloadMyRat();
                }
            });
        };
        $scope.loadingMyRat();

        $scope.reloadMyRat = function () {
            if ($scope.myRat != null) {
                $scope.isShowMyRat = true;
                for (var i = 0; i < ratValues.length - 1; i++) {
                    if ($scope.myRat.AverageTotal >= ratValues[i].Number &&
                        $scope.myRat.AverageTotal <= ratValues[i + 1].Number) {
                        $scope.myRat.RateName = ratValues[i].Name;
                        break;
                    }
                }
            } else {
                $scope.isShowMyRat = false;
            }
        };

        // PAGING FOR COMMENTS

        commonService.datetimePicker($scope);
        $scope.commonService = commonService;
        $scope.tourComments;

        $scope.resetFilter = function () {
            $scope.paging = {currentPage: 1, totalPage: 6, pageSize: 5, currentItem: 0, totalItems: 120};
            $scope.filter = {keyword: "", pageNumber: 1, pageSize: 5};
        }

        $scope.filterItems = function () {

            httpService.sendGet(apiRoutes.tourCommentFilter.replace('{IdTour}', $stateParams.tourId),
                $scope.filter,
                $scope.setContentLoading).then(function (response) {
                    //TODO: check response
                    if (response && response.Success === true) {
                        $scope.tourComments = response.Data ? response.Data.Items : [];
                        $scope.copiedData = $scope.tourComments;
                        $scope.paging = commonService.preparePagination(response);
                    }
                });
        }

        if ($stateParams.tourId) {
            $scope.resetFilter();
            $scope.filterItems();
        }

        //$scope.getCheckedText = function(isVerified) {
        //    return isVerified ? "Checked" : "Not yet";
        //}
        $scope.searchPageChange = function (flag, pageNumber) {
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
            $scope.filterItems();
        };

        $scope.searchClick = function () {
            debugger
            $scope.filter.pageNumber = 1;
            $scope.filterItems();
        };

        // functions for searching (auto complete)
        $scope.searchText = '';
        $scope.simulateQuery = false;
        $scope.isDisabled = false;

        // list of `state` value/display objects
        //self.data = $scope.datas;

        $scope.searchTextChange = function (searchedString) {
            //$log.info('Text changed to ' + text);
        }

        $scope.selectedItemChange = function (item) {
            //$log.info('Item changed to ' + JSON.stringify(item));
        }

    }

    angular.module('app').controller('TourDetailController', ['$scope', '$location', '$stateParams', 'commonService', 'HttpService', 'NgMap', 'API_ROUTES', 'RAT_VALUES', 'alertify', tourDetailController]);
})();

function InitMap() {
    var map;
    var markers = [];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: 10.7750993, lng: 106.6586053}
    });

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    document.getElementById('submitGeocoding').addEventListener('click', function () {
        geocodeLatLng(geocoder, infowindow);
    });

    document.getElementById('submitReverseGeocoding').addEventListener('click', function () {
        geocodeAddress(geocoder, infowindow);
    });

    map.addListener('click', function (event) {
        createMarker(event.latLng, event.latLng.lat(), event.latLng.lng(), "");
    });


    function geocodeLatLng(geocoder, infowindow) {
        var input = document.getElementById('latlng').value;
        var latlngStr = input.split(',', 2);
        var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        deleteMarkers();
        geocoder.geocode({'location': latlng}, function (results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    map.setCenter(results[1].geometry.location);
                    createMarker(results[1].geometry.location, results[1].geometry.location.lat(), results[1].geometry.location.lng(), results[1].formatted_address);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    function geocodeAddress(geocoder, infowindow) {
        var address = document.getElementById('address').value;
        deleteMarkers();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                createMarker(results[0].geometry.location, results[0].geometry.location.lat(), results[0].geometry.location.lng(), results[0].formatted_address);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function createMarker(latLng, lat, lng, address) {
        var newMarker = new google.maps.Marker({position: latLng, map: map});
        var newInfowindow = new google.maps.InfoWindow;
        newInfowindow.setContent('Address: ' + address + '<br />Lat: ' + lat + ', Lng: ' + lng)
        newInfowindow.open(newMarker.get('map'), newMarker);

        newMarker.addListener('click', function () {
            document.getElementById('latlng').value = lat + ',' + lng;
            document.getElementById('address').value = address;
        });

        markers.push(newMarker);
    }


    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
}