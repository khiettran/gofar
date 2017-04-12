/**
 * @ngdoc overview
 * @name Member controller
 * @description
 *
 */
(function () {
    function cartController($scope, $location, $state, $stateParams, $window, $filter, commonService, httpService, paymentSteps, appRoutes, apiRoutes, alertify) {
        // Declare variable
        if (!$stateParams.tourId) {
            alertify.logPosition("top right").error($filter('translate')('errorMessages.invalidUrl'));
            $location.path(appRoutes.homePage);
        }
        else {
            $scope.discountCodes = [{code: "Discount1", discountPrice: -100000}, {
                code: "Discount2",
                discountPrice: -200000
            }];
            if ($window.localStorage.memberCart) {
                $scope.memberCart = JSON.parse($window.localStorage.memberCart);
            } else {
                $scope.memberCart = {
                    Customers: [],
                    TourId: $stateParams.tourId,
                    tour: {},
                    step: paymentSteps.customerInfo,
                    totalPrice: 0,
                    discountCodes: [],
                    executeLink: ""
                };
                // GET tour info
                var url = apiRoutes.tourDetail.replace("{tourId}", $stateParams.tourId);
                httpService.sendGet(url).then(function (response) {
                    if (response && response.Success === true) {
                        $scope.memberCart.tour = response.Data;
                        console.log(response.Data);
                    }
                });
            }
            if ($window.localStorage.memberInfo) {
                var memberInfo = JSON.parse($window.localStorage.memberInfo);
                $scope.memberCart.AccountId = memberInfo.Id;
            }

            $scope.memberCart.TourId = $stateParams.tourId;

            commonService.datetimePicker($scope);
            $scope.commonService = commonService;
            $scope.customer = {fullName: ""};
            $scope.paymentSteps = paymentSteps;

            $scope.addCustomer = function () {
                var age = calculateAge($scope.customer.birthDay);
                console.log($scope.memberCart.tour);
                if ($scope.memberCart.tour.PromotionPrice < $scope.memberCart.tour.PriceAdult) {
                    var temp = {
                        FullName: $scope.customer.fullName
                        ,
                        BirthDay: $scope.customer.birthDay
                        ,
                        ticketType: age > 12 ? "Người lớn" : (age > 2 ? "Trẻ em" : "Trẻ sơ sinh")
                        ,
                        price: age > 12 ? $scope.memberCart.tour.PromotionPrice : (age > 2 ? $scope.memberCart.tour.PromotionPriceChild : $scope.memberCart.tour.PriceInfant)
                    }
                    $scope.memberCart.totalPrice += temp.price;
                    $scope.memberCart.Customers.push(temp);
                }
                else {
                    var temp = {
                        FullName: $scope.customer.fullName
                        ,
                        BirthDay: $scope.customer.birthDay
                        ,
                        ticketType: age > 12 ? "Người lớn" : (age > 2 ? "Trẻ em" : "Trẻ sơ sinh")
                        ,
                        price: age > 12 ? $scope.memberCart.tour.PriceAdult : (age > 2 ? $scope.memberCart.tour.PriceChild : $scope.memberCart.tour.PriceInfant)
                    }
                    $scope.memberCart.totalPrice += temp.price;
                    $scope.memberCart.Customers.push(temp);
                }
            }

            $scope.applyDiscountCode = function () {
                var index = $scope.discountCodes.indexOfObject('code', $scope.discountCode);
                if (index >= 0) {
                    $scope.memberCart.totalPrice += $scope.discountCodes[index].discountPrice;
                    $scope.memberCart.discountCodes.push($scope.discountCodes[index]);
                    $scope.memberCart.totalPrice = $scope.memberCart.totalPrice < 1 ? 0 : $scope.memberCart.totalPrice;
                } else {
                    alertify.logPosition("top right").error($filter('translate')('Mã giảm giá không tồn tại'));
                }
            }
            $scope.nextStep1 = function () {
                if ($scope.memberCart && $scope.memberCart.Customers.length > 0) {
                    $scope.memberCart.step = paymentSteps.customerPaymentInfo;
                    $window.localStorage.setItem("memberCart", JSON.stringify($scope.memberCart));
                    $state.go('app.payment.customer');
                }
            }

            // Payment Info
            $scope.doPurchase = function () {
                if (!validateCustomerPaymentInfo())
                    return;
                httpService.sendPost(apiRoutes.paymentCreateBill, $scope.memberCart, $scope.setContentLoading).then(function (response) {
                    if (response && response.Data) {
                        $scope.approvalLink = "";
                        $scope.executeLink = "";
                        for (var i = 0; i < response.Data.Link.length; i++) {
                            if (response.Data.Link[i].rel == "approval_url") {
                                $scope.approvalLink = response.Data.Link[i].href;
                            } else if (response.Data.Link[i].rel == "execute") {
                                $scope.executeLink = response.Data.Link[i].href;
                            }
                        }
                        if ($scope.approvalLink != "") {
                            $scope.memberCart.executeLink = $scope.executeLink;
                            $scope.memberCart.step = paymentSteps.finishPayment;
                            $window.localStorage.setItem("memberCart", JSON.stringify($scope.memberCart));
                            $window.open($scope.approvalLink);
                        }
                        else
                            alertify.logPosition("top right").error("Có lỗi xảy ra trong quá trình thanh toán");
                    }
                    else
                        alertify.logPosition("top right").error("Có lỗi xảy ra trong quá trình thanh toán");
                });
            }

            // Finish Payment                  
            if ($stateParams.statusId == 1) {
                console.log($scope.memberCart.executeLink, $location.search().PayerID)
                if ($scope.memberCart.step == paymentSteps.finishPayment && $scope.memberCart.executeLink && $scope.memberCart.executeLink != "") {
                    httpService.sendGet(apiRoutes.getAccessToken, $scope.setContentLoading).then(function (response) {
                        if (response && response.Success) {
                            httpService.sendPostPaypal($scope.memberCart.executeLink, {payer_id: $location.search().PayerID}, response.Data).then(function (response) {
                                console.log(response);
                                if (response) {
                                    //var paymentHistory = [];
                                    //if ($window.localStorage.paymentHistory) {
                                    //    paymentHistory = JSON.parse($window.localStorage.paymentHistory);
                                    //    paymentHistory.push($scope.memberCart);
                                    //} else {
                                    //    paymentHistory.push($scope.memberCart);
                                    //}                                
                                    // Call sv update payment                                
                                    $window.localStorage.removeItem("memberCart");
                                    //$window.localStorage.setItem("paymentHistory", paymentHistory);
                                    alertify.logPosition("top right").success("Thanh toán thành công, hệ thống tự động trở về trang chủ sau 5 giây");
                                    setTimeout(function () {
                                        $state.go("app.home");
                                    }, 5000);
                                }
                            });
                        } else {
                            alertify.logPosition("top right").error("Có lỗi xảy ra trong quá trình thanh toán");
                        }
                    });
                }
            }
        }

        function validateCustomerPaymentInfo() {
            if (!$scope.paymentMenthod || ($scope.paymentMenthod != 1 && $scope.paymentMenthod != 2 && $scope.paymentMenthod != 3)) {
                alertify.logPosition("top right").error('Bạn chưa chọn phương thức thanh toán');
                return false;
            }
            if (isEmpty($scope.memberCart.PayerName)) {
                alertify.logPosition("top right").error('Họ tên không được để trống');
                return false;
            }
            if (isEmpty($scope.memberCart.PayerEmail)) {
                alertify.logPosition("top right").error('Email không được để trống');
                return false;
            }
            if (isEmpty($scope.memberCart.PayerPhone)) {
                alertify.logPosition("top right").error('Số điện thoại không được để trống');
                return false;
            }
            if ($scope.isCreateAccount) {
                if (isEmpty($scope.memberCart.PayerPassword)) {
                    alertify.logPosition("top right").error('Mật khẩu không được để trống');
                    return false;
                }
                if ($scope.memberCart.PayerPassword.length < 6 || $scope.memberCart.PayerPassword.length > 64) {
                    alertify.logPosition("top right").error('Mật khậu phải từ 6-64 ký tự');
                    return false;
                }
                if ($scope.memberCart.PayerPassword != $scope.memberCart.PayerRePassword) {
                    alertify.logPosition("top right").error("Mật khẩu nhập lại không chính xác");
                    return false;
                }
            }
            return true;
        }
    }

    angular.module('app').controller('CartController', ['$scope', '$location', '$state', '$stateParams', '$window', '$filter', 'commonService', 'HttpService', 'PAYMENT_STEPS', 'APP_ROUTES', 'API_ROUTES', 'alertify', cartController]);
})();
