/**
 * @ngdoc overview
 * @name 
 * @description 
 *
 */
(function() {
    function tourRatingModificationController($scope, $timeout, $mdSidenav, $log, $stateParams, $window, httpService, ratValues, apiRoutes, alertify) {
        
        $scope.memberInfo = $window.localStorage.memberInfo;
        $scope.goToRating = buildToggler('tour-rating-content');
        $scope.toggleComment = buildToggler('tour-comment-content');
        $scope.toggleRating = function(myRat) {
            $scope.ratModel.Facility = myRat ? myRat.Facility : 10;
            $scope.ratModel.Human = myRat ? myRat.Human : 10;
            $scope.ratModel.Service = myRat ? myRat.Service : 10;
            $scope.ratModel.Interesting = myRat ? myRat.Interesting : 10;
            $scope.goToRating();
        };

        $scope.ratValues = ratValues;

        $scope.ratModel = {
            Id: -1,
            Facility: 10,
            Human: 10,
            Service: 10,
            Interesting: 10,
            Average: 1,
            AccountProfileId: -1,
            TourId: $stateParams.tourId,
            CreatedBy: '',
            CreatedAt: '',
            UpdatedBy: '',
            UpdatedAt: ''
        };
        $scope.cmtModel = {
            Id: -1,
            FullName: '',
            Comment: '',
            LikeNumber: 0,
            AvatarUrl: '',
            AccountProfileId: -1,
            TourId: $stateParams.tourId,
            CreatedBy: '',
            CreatedAt: '',
            UpdatedBy: '',
            UpdatedAt: ''
        };

        $scope.isOpenCommentContent = function() {
            return true;
          //return $mdSidenav('tour-comment-content').isOpen();
        };

        $scope.isOpenRatingContent = function(){
            return true;
          //return $mdSidenav('tour-rating-content').isOpen();
        };

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
          var timer;

          return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
              timer = undefined;
              func.apply(context, args);
            }, wait || 10);
          };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
          return debounce(function() {
              // Component lookup should always be available since we are not using `ng-if`
              $timeout(function () {
                  $mdSidenav(navID).toggle();
              });
          })
          //  $mdSidenav(navID)
          //    .toggle()
          //    .then(function () {
          //      $log.debug("toggle " + navID + " is done");
          //    });
          //}, 200);
        }

        function buildToggler(navID) {
          return function() {

              $timeout(function () {
                $mdSidenav(navID).toggle();
              })
            //$mdSidenav(navID)
            //  .toggle()
            //  .then(function () {
            //    $log.debug("toggle " + navID + " is done");
            //  });
          };
        }

        $scope.close = function (navID) {
          // Component lookup should always be available since we are not using `ng-if`
            $timeout(function(){
                $mdSidenav(navID).close();
            });
          //$mdSidenav(navID).close()
          //  .then(function () {
          //    $log.debug("close " + navID + " is done");
          //  });
        };

        function validateCommentBeforeSubmit() {
            var errorMessage = '';
            var cmtModel = $scope.cmtModel;
            
            $scope.cmtModel.CreatedAt = $scope.cmtModel.UpdatedAt = new Date();
            if ($scope.memberInfo != null) {
                var member = JSON.parse($scope.memberInfo);
                if (member != null) {
                    $scope.cmtModel.CreatedBy = $scope.cmtModel.UpdatedBy = member.Id;
                } else {
                    $scope.cmtModel.CreatedBy = $scope.cmtModel.UpdatedBy = 1;
                }
                $scope.cmtModel.AccountProfileId = member.Id;
            } else {
                errorMessage += 'Bạn cần phải đăng nhập mới có thể thực hiện chức năng này.';
            }

            if (cmtModel.Comment.trim() == "") {
              errorMessage += 'Bạn chưa điền thông tin bình luận.';
            }
           
            return errorMessage;
        }

        function validateRatingBeforeSubmit() {
            var errorMessage = '';
            var ratModel = $scope.ratModel;

            $scope.ratModel.CreatedAt = $scope.ratModel.UpdatedAt = new Date();
            if ($scope.memberInfo != null) {
                var member = JSON.parse($scope.memberInfo);
                if (member != null) {
                    $scope.ratModel.CreatedBy = $scope.ratModel.UpdatedBy = member.Id;
                } else {
                    $scope.ratModel.CreatedBy = $scope.ratModel.UpdatedBy = 1;
                }
                $scope.ratModel.AccountProfileId = member.Id;
            } else {
                errorMessage += 'Bạn cần phải đăng nhập mới có thể thực hiện chức năng này.';
            }
            return errorMessage;
        }

        $scope.sendComment = function(filterItems) {

            var result = validateCommentBeforeSubmit();

            if (!isEmpty(result)) {
                alertify.logPosition("top right").error(result);
                return;
            }

            httpService.sendPost(apiRoutes.tourCommentAdd, $scope.cmtModel).then(function (response) {
                if (response && response.Success === true) {
                    filterItems();
                    $scope.cmtModel.Comment = "";
                    $scope.close('tour-comment-content');
                }
            });
        };

        $scope.sendRating = function(loadingMyRat) {
            var result = validateRatingBeforeSubmit();
            if (!isEmpty(result)) {
                alertify.logPosition("top right").error(result);
                return;
            }

            $scope.ratModel.Average = ($scope.ratModel.Facility +
                                        $scope.ratModel.Human +
                                        $scope.ratModel.Service + 
                                        $scope.ratModel.Interesting) / 4;

            httpService.sendPost(apiRoutes.tourRatingAdd, $scope.ratModel).then(function (response) {
                if (response && response.Success === true) {
                    $scope.close('tour-rating-content');
                    myRat = response.Data;
                    loadingMyRat();
                }
            });
        };
    }

    angular.module('app')
    .controller('TourRatingModificationController', ['$scope', '$timeout', '$mdSidenav', '$log', '$stateParams', '$window', 'HttpService', 'RAT_VALUES', 'API_ROUTES', 'alertify', tourRatingModificationController]);
})();


    