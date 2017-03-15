'use strict';

var ApiRootURL = "http://localhost:3000/";
var Authorization = "";
var ApplicationTokenId = "";
var ClassifyIds = { Web: 4 };

angular.module("app").constant("APP_ROUTES", {
    homePage: "app/trang-chu",
    memberSignin: "app/dang-nhap"
});

angular.module("app").constant("RAT_VALUES", [
  {Number: 1, Name: "Rất tệ"},
  {Number: 2, Name: "Tệ"},
  {Number: 3, Name: "Khá tệ"},
  {Number: 4, Name: "Khá ổn"},
  {Number: 5, Name: "Bình thường"},
  {Number: 6, Name: "Khá"},
  {Number: 7, Name: "Rất khá"},
  {Number: 8, Name: "Tốt"},
  {Number: 9, Name: "Rất tốt"},
  {Number: 10, Name: "Tuyệt vời"}
]);

angular.module("app").constant("TOUR_CATEGORIES", [
  { categoryId: 1, name: "Du lịch bắc bộ" },
  { categoryId: 2, name: "Du lịch nam bộ" },
  { categoryId: 3, name: "Du lịch trung bộ" },
  { categoryId: 4, name: "Du lịch đảo" }, 
]);

angular.module("app").constant("PAYMENT_STEPS", {
  customerInfo: 1,
  customerPaymentInfo: 2,
  finishPayment: 3,  
});

angular.module("app").constant("API_ROUTES", {
    memberLogin: "api/v1/access/loginmember",
    memberLogout: "api/v1/access/logout",
    memberSignUp: "api/v1/user/signup",
    memberSignUpFB: "api/v1/user/signupfb",
    tourFilter: "api/v1/tour/filter",
    tourDetail: "api/v1/tour/{tourId}/detail",
    tourCommentFilter: "api/v1/tourcomment/filter/{IdTour}",
    tourCommentAdd: "api/v1/tourcomment/add",
    tourRatingAdd: "api/v1/tourrating/add",
    tourRatingUpdate: "api/v1/tourrating/update",
    tourRatingDetail: "api/v1/tourrating/detail/{IdTour}/{IdAccount}",
    vehicleCategoryDetail: "api/v1/vehiclecategory/detail/{Id}",
    vehicleCompanyDetail: "api/v1/vehiclecompany/detail/{Id}",
    vehicleDetail: "api/v1/vehicle/detail/{1}",
    getAccessToken: "api/v1/payment/accesstoken",
    paymentCreateBill: "api/v1/payment/create",
    paypalBillingAgreement: "https://api.sandbox.paypal.com/v1/payments/billing-agreements",    
});
    