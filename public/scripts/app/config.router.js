/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
(function () {
    'use strict';
    angular.module('app').factory('authInterceptor', function ($rootScope, $q, $window, $location, APP_ROUTES) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (config.url.substring(0, 30) != "https://api.sandbox.paypal.com") {
                    if ($window.localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                    }
                    config.headers.DeviceTypeId = 4;
                }
                return config;
            },
            response: function (response) {

                return response || $q.when(response);
            }
        };
    });

    angular
        .module('app')
        .run(runBlock)
        .config(config);

    runBlock.$inject = ['$rootScope', '$state', '$stateParams', '$window'];
    function runBlock($rootScope, $state, $stateParams, $window) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on("$stateChangeStart", function (event, toState) {
            if (toState.isAuthenticationRequired
                && ($window.localStorage.token == undefined || $window.localStorage.token == null || $window.localStorage.token === "")) {
                // User isn’t authenticated
                event.preventDefault();
                $state.go("access.signin");
            }
        });
    }

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'MODULE_CONFIG'];
    function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, MODULE_CONFIG) {
        var layout = '/views/layout.html';
        $locationProvider.html5Mode(true).hashPrefix('!');
        $urlRouterProvider
            .otherwise('/app/trang-chu');
        $stateProvider
            .state('app', {
                abstract: true,
                isAuthenticationRequired: false,
                url: '/app',
                views: {
                    '': {
                        templateUrl: layout
                    }
                }
            })
            .state('app.home', {
                url: '/trang-chu',
                templateUrl: '/views/home/index.html',
                isAuthenticationRequired: false,
                data: {title: 'Trang chủ'},
                controller: "HomeController",
                resolve: load(['HomeController', '/scripts/app/controllers/home/home.controller.js',
                    '/scripts/libs/angular/angular-map/ng-map.min.js'])
            })
            .state('app.search', {
                url: '/trang-chu/{categoryId}',
                templateUrl: '/views/home/index.html',
                isAuthenticationRequired: false,
                data: {title: 'Tìm kiếm tour'},
                controller: "HomeController",
                resolve: load(['HomeController', '/scripts/app/controllers/home/home.controller.js',
                    '/scripts/libs/angular/angular-map/ng-map.min.js'])
            })
            .state('app.tour', {
                url: '/chi-tiet/:tourId',
                templateUrl: '/views/tour/detail.html',
                isAuthenticationRequired: false,
                data: {title: 'Chi tiết tour'},
                controller: "TourDetailController",
                resolve: load(['TourDetailController', '/scripts/libs/angular/angular-owl-carousel/angular-owl-carousel.js',
                    '/scripts/libs/angular/angular-map/ng-map.min.js'])
            })
            .state('app.payment', {
                url: '/thanh-toan/:tourId',
                templateUrl: '/views/payment/index.html',
                isAuthenticationRequired: false,
                data: {title: 'Thanh toán'},
                controller: "CartController",
                resolve: load(['CartController', '/scripts/app/controllers/payment/cart.controller.js'])
            })
            .state('app.payment.cart', {
                url: '/thong-tin-khach-hang',
                templateUrl: '/views/payment/cart.html',
                isAuthenticationRequired: false,
                data: {title: 'Thông tin thanh toán'},
                controller: "CartController",
                resolve: load(['CartController', '/scripts/app/controllers/payment/cart.controller.js'])
            })
            .state('app.payment.customer', {
                url: '/thong-tin-thanh-toan',
                templateUrl: '/views/payment/customer.html',
                isAuthenticationRequired: false,
                data: {title: 'Thông tin thanh toán'},
                controller: "CartController",
                resolve: load(['CartController', '/scripts/app/controllers/payment/cart.controller.js'])
            })
            .state('app.payment.complete', {
                url: '/hoan-tat/:statusId?',
                templateUrl: '/views/payment/complete.html',
                isAuthenticationRequired: false,
                data: {title: 'Hoàn tất thanh toán'},
                controller: "CartController",
                resolve: load(['CartController', '/scripts/app/controllers/payment/cart.controller.js'])
            })
            //  .state('app.home.feed', {
            //      url: '/feed',
            //      templateUrl: '/Views1/home/feed/feed.html',
            //      isAuthenticationRequired: false,
            //      data: { title: 'Feeds' }
            //  })
            //  .state('app.home.post', {
            //      url: '/post',
            //      templateUrl: '/Views1/home/post/post.html',
            //      isAuthenticationRequired: false,
            //      data: { title: 'Posts' }
            //  })

            //// Access routers
            // .state('404', {
            //     url: '/404',
            //     templateUrl: '../../views/misc/404.html'
            // })
            //  .state('505', {
            //      url: '/505',
            //      templateUrl: '../../views/misc/505.html'
            //  })
            //.state('access', {
            //    url: '/access',
            //    template: '<div class="dark bg-auto w-full"><div ui-view class="fade-in-right-big smooth pos-rlt"></div></div>'
            //})            
            .state('app.signin', {
                url: '/dang-nhap',
                templateUrl: '/views/User/login.html',
                controller: 'SignInController',
                resolve: load(['SignInController', '/scripts/app/controllers/access/signin.controller.js'])
            })
            .state('app.signup', {
                url: '/dang-ky',
                templateUrl: '/views/User/register.html',
                controller: 'SignUpController',
                resolve: load(['SignUpController', '/scripts/app/controllers/access/signup.controller.js'])
            })
            .state('app.contact', {
                url: '/lien-he',
                templateUrl: '/views/User/contact.html',
                controller: 'ContactController',
                resolve: load(['ContactController', '/scripts/app/controllers/access/contact.controller.js',
                    '/scripts/libs/angular/angular-map/ng-map.min.js'])
            }).state('app.personal', {
            url: '/thong-tin',
            templateUrl: '/views/user/personal/index.html',
            controller: 'PersonalController',
            resolve: load(['PersonalController', '/scripts/app/controllers/user/personal.controller.js'])
        }).state('app.personal.account', {
            url: '/tai-khoan',
            templateUrl: '/views/user/personal/account.html',
        }).state('app.personal.info', {
            url: '/ca-nhan',
            templateUrl: '/views/user/personal/info.html',
        }).state('app.personal.history', {
            url: '/lich-su-giao-dich',
            templateUrl: '/views/user/personal/history.html',
        });
        //  .state('access.forgot-password', {
        //      url: '/forgot-password',
        //      templateUrl: '../../views/misc/forgot-password.html'
        //  })
        //  .state('access.lockme', {
        //      url: '/lockme',
        //      templateUrl: '../../views/misc/lockme.html'
        //  })
        //;
        $httpProvider.interceptors.push('authInterceptor');

        // Private function
        function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                    function ($ocLazyLoad, $q) {
                        var deferred = $q.defer();
                        var promise = false;
                        srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                        if (!promise) {
                            promise = deferred.promise;
                        }
                        angular.forEach(srcs, function (src) {
                            promise = promise.then(function () {
                                angular.forEach(MODULE_CONFIG, function (module) {
                                    if (module.name === src) {
                                        src = module.module ? module.name : module.files;
                                    }
                                });
                                return $ocLazyLoad.load(src);
                            });
                        });
                        deferred.resolve();
                        return callback ? promise.then(function () {
                                return callback();
                            }) : promise;
                    }]
            }
        }

        function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }
})();
