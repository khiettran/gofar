/**
 * @ngdoc function
 * @name app.directives
 * @description
 */

(function() {
    'use strict';
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    }

    function initActiveLink($location) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var activeClass = $attrs.ngActiveLink;
                var path = $attrs.href;                
                $scope.location = $location;
                $scope.$watch('location.path()', function (newPath) {
                    
                    if (path === newPath) {
                        $element.addClass(activeClass);                       
                    } else {
                        $element.removeClass(activeClass);
                    }
                });
            }
        };
    }

    angular.module('app').directive('ngActiveLink', ["$location", function ($location) {
	        return initActiveLink($location);
	    }
    ]);

    angular.module('app').directive('stickyMenuInit', function () {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                // STICKY HEADER                
                var $fixed = element,                    
                offsetTop = $fixed.offset().top,
                scrollTop = $(window).scrollTop(),
                height = $fixed.outerHeight(),
                limitTop = offsetTop + height;                
                $fixed.data('scrollTop', scrollTop);
                $(window).scroll(function () {
                    var scrollTop = $(window).scrollTop(),
                        beforeTop = $fixed.data('scrollTop');

                    if (beforeTop < scrollTop) {
                        if (!$fixed.hasClass('header-page__fixed')) {
                            if (scrollTop > limitTop) {
                                var transform = 'translateY(-' + height + 'px)';
                                $fixed.addClass('header-page__fixed')
                                    .css({
                                        '-webkit-transform': transform,
                                        '-moz-transform': transform,
                                        '-ms-transform': transform,
                                        '-o-transform': transform,
                                        'transform': transform,
                                    }).data('y', height);
                            }
                        }
                        else {
                            var y = $fixed.data('y'),
                                offsetScroll = beforeTop - scrollTop,
                                newTop = (y + offsetScroll) < height ? (y - offsetScroll) : height,
                                newTransform = 'translateY(-' + newTop + 'px)';
                            $fixed.css({
                                '-webkit-transform': newTransform,
                                '-moz-transform': newTransform,
                                '-ms-transform': newTransform,
                                '-o-transform': newTransform,
                                'transform': newTransform,
                            }).data('y', newTop);

                        }
                    }
                    else {
                        if ($fixed.hasClass('header-page__fixed')) {
                            var y = $fixed.data('y'),
                                offsetScroll = beforeTop - scrollTop,
                                newTop = (y - offsetScroll) > 0 ? (y - offsetScroll) : 0,
                                newTransform = 'translateY(-' + newTop + 'px)';

                            $fixed.css({
                                '-webkit-transform': newTransform,
                                '-moz-transform': newTransform,
                                '-ms-transform': newTransform,
                                '-o-transform': newTransform,
                                'transform': newTransform,
                            }).data('y', newTop);

                            if (scrollTop < offsetTop) {
                                $fixed.removeClass('header-page__fixed');
                                $fixed.css({
                                    '-webkit-transform': 'translateY(0px)',
                                    '-moz-transform': 'translateY(0px)',
                                    '-ms-transform': 'translateY(0px)',
                                    '-o-transform': 'translateY(0px)',
                                    'transform': 'translateY(0px)',
                                }).data('y', newTop)
                            }
                        }
                    }
                    $fixed.data('scrollTop', scrollTop);
                }).trigger('scroll');


                // Config Header    
                var dataResponsive = $('.navigation').data('responsive'),
                  windowWidth = window.innerWidth,
                  windowHeight = window.innerHeight,
                  headerHeight = $('#header-page').height();
                $('.toggle-menu-responsive').hide();
                if (windowWidth <= dataResponsive) {
                    $('.toggle-menu-responsive').show();
                    $('.navigation').prependTo('#page-wrap');
                    $('.navigation')
                        .removeClass('awe-navigation')
                        .addClass('awe-navigation-responsive');
                    $('.awe-navigation-responsive').height(windowHeight - headerHeight);
                    $('.search-box .form-search').css('right', '-60px');
                    subToggle();
                    submenuBack();
                } else {
                    $('.navigation').insertAfter('.header-page__inner .logo');
                    $('.navigation')
                        .removeClass('awe-navigation-responsive')
                        .addClass('awe-navigation');
                    $(document).find('.navigation').css('height', 'auto');
                    $('.search-box .form-search').css('right', '0');
                    $('.submenu-toggle, .back-mb').remove();
                }
                $('.search-box .form-search').width($('#header-page .container').width());
                // End config Header

                if ($('#header-page nav').hasClass('awe-navigation-hamburger')) {
                    $('#header-page nav').attr('data-responsive', 100000);
                }
                if (isMobile.any()) {
                    $('.search-box').on('click', '.searchtoggle', function () {
                        $(this).toggleClass('searchtoggle-active');
                        $(this).siblings('.form-search').toggleClass('form-active');
                    });
                    $(document).on('click', function () {
                        $('.search-box .searchtoggle').removeClass('searchtoggle-active');
                        $('.search-box .form-search').removeClass('form-active');
                        $('.minicart-body')
                            .removeClass('cart-toggle');
                        $('.toggle-minicart').removeClass('toggle-active');
                    });
                    $(document).on('click', '.search-box', function (e) {
                        e.stopPropagation();
                    });
                } else {
                    $('.search-box').hover(function () {
                        $('.search-box .form-search').addClass('form-active');
                    }, function () {
                        $('.search-box .form-search').removeClass('form-active');
                    });
                }
            }
        };
    });

    angular.module('app').directive('imageSliderInit', function () {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                var revapi = element.show().revolution({
                    ottedOverlay: "none",
                    delay: 10000,
                    startwidth: 1600,
                    startheight: 650,
                    hideThumbs: 200,

                    thumbWidth: 100,
                    thumbHeight: 50,
                    thumbAmount: 5,


                    simplifyAll: "off",

                    navigationType: "none",
                    navigationArrows: "solo",
                    navigationStyle: "preview4",

                    touchenabled: "on",
                    onHoverStop: "on",
                    nextSlideOnWindowFocus: "off",

                    swipe_threshold: 0.7,
                    swipe_min_touches: 1,
                    drag_block_vertical: false,

                    parallax: "mouse",
                    parallaxBgFreeze: "on",
                    parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],


                    keyboardNavigation: "off",

                    navigationHAlign: "center",
                    navigationVAlign: "bottom",
                    navigationHOffset: 0,
                    navigationVOffset: 20,

                    soloArrowLeftHalign: "left",
                    soloArrowLeftValign: "center",
                    soloArrowLeftHOffset: 20,
                    soloArrowLeftVOffset: 0,

                    soloArrowRightHalign: "right",
                    soloArrowRightValign: "center",
                    soloArrowRightHOffset: 20,
                    soloArrowRightVOffset: 0,

                    shadow: 0,
                    fullWidth: "on",
                    fullScreen: "off",

                    spinner: "spinner2",

                    stopLoop: "off",
                    stopAfterLoops: -1,
                    stopAtSlide: -1,

                    shuffle: "off",

                    autoHeight: "off",
                    forceFullWidth: "off",



                    hideThumbsOnMobile: "off",
                    hideNavDelayOnMobile: 1500,
                    hideBulletsOnMobile: "off",
                    hideArrowsOnMobile: "off",
                    hideThumbsUnderResolution: 0,

                    hideSliderAtLimit: 0,
                    hideCaptionAtLimit: 0,
                    hideAllCaptionAtLilmit: 0,
                    startWithSlide: 0
                });

                return scope.$on('$destroy', function() {
                    return revapi.revkill();
                });
            }
        };
    });


    angular.module('app').directive('initProductSlider', function () {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                var paginationSlider = ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'];

                if ($('.product-slider').length) {
                    $('.product-slider').owlCarousel({
                        autoPlay: false,
                        slideSpeed: 500,
                        navigation: true,
                        pagination: false,
                        singleItem: true,
                        autoHeight: true,
                        navigationText: paginationSlider,
                        afterAction: syncPosition
                    });

                    $('.product-slider-thumb').owlCarousel({
                        slideSpeed: 500,
                        items: 5,
                        itemsCustom: [[320, 3], [480, 4], [768, 4], [992, 5], [1200, 5]],
                        pagination: false,
                        navigation: false,
                        navigationText: paginationSlider,
                        mouseDrag: false,
                        afterInit: function (el) {
                            el.find(".owl-item").eq(0).addClass("synced");
                        }
                    });

                    $('.product-slider-thumb').on("click", ".owl-item", function (e) {
                        e.preventDefault();
                        if ($(this).hasClass('synced')) {
                            return false;
                        } else {
                            var number = $(this).data("owlItem");
                            $('.product-slider').trigger("owl.goTo", number);
                        }
                    });
                }

                function syncPosition(el) {
                    var current = this.currentItem;
                    $('.product-slider-thumb')
                        .find(".owl-item")
                        .removeClass("synced")
                        .eq(current)
                        .addClass("synced")
                    if ($('.product-slider-thumb').data("owlCarousel") !== undefined) {
                        center(current)
                    }
                }
            }
        };
    });    

    //angular.module('app').directive('headerInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            // STICKY HEADER
    //            element.sticky({ topSpacing: 0 });
    //        }
    //    };
    //});

    //angular.module('app').directive('featuredProductInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            // STICKY HEADER
    //            $('#loader').fadeOut("slow");                
    //            // Isotope
    //            var $container = $('#isotope');
    //            $container.isotope({
    //                itemSelector: '.isotope-item'
    //            });
    //            var $optionSets = $('.filter'),
    //                    $optionLinks = $optionSets.find('a');
    //            $optionLinks.click(function () {
    //                var $this = $(this);
    //                if ($this.hasClass('selected')) {
    //                    return false;
    //                }
    //                var $optionSet = $this.parents('.filter');
    //                $optionSet.find('.selected').removeClass('selected');
    //                $this.addClass('selected');
    //                var options = {},
    //                        key = $optionSet.attr('data-option-key'),
    //                        value = $this.attr('data-option-value');
    //                value = value === 'false' ? false : value;
    //                options[key] = value;
    //                if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
    //                    changeLayoutMode($this, options);
    //                } else {
    //                    $container.isotope(options);
    //                }
    //                return false;
    //            });
    //        }
    //    };
    //});

    //angular.module('app').directive('carouselInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            element.slick({
    //                dots: false,
    //                infinite: true,
    //                speed: 300,
    //                slidesToShow: 2,
    //                slidesToScroll: 1,
    //                responsive: [{
    //                    breakpoint: 1024,
    //                    settings: {
    //                        slidesToShow: 1,
    //                        slidesToScroll: 1,
    //                        infinite: true,
    //                        dots: true
    //                    }
    //                }, {
    //                    breakpoint: 480,
    //                    settings: {
    //                        slidesToShow: 1,
    //                        slidesToScroll: 1
    //                    }
    //                }]
    //            });
    //        }
    //    };
    //});

    //angular.module('app').directive('productCarousel3Init', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            element.slick({
    //                dots: false,
    //                infinite: true,
    //                speed: 300,
    //                slidesToShow: 4,
    //                slidesToScroll: 1,
    //                responsive: [{
    //                    breakpoint: 1024,
    //                    settings: {
    //                        slidesToShow: 3,
    //                        slidesToScroll: 1,
    //                        infinite: true,
    //                        dots: true
    //                    }
    //                }, {
    //                    breakpoint: 480,
    //                    settings: {
    //                        slidesToShow: 1,
    //                        slidesToScroll: 1
    //                    }
    //                }]
    //            });
    //        }
    //    }
    //});

    //angular.module('app').directive('clientCarouselInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            element.slick({
    //                dots: false,
    //                infinite: true,
    //                speed: 600,
    //                autoplay: true,
    //                autoplaySpeed: 3000,
    //                slidesToShow: 6,
    //                slidesToScroll: 1,
    //                responsive: [{
    //                    breakpoint: 1024,
    //                    settings: {
    //                        slidesToShow: 3,
    //                        slidesToScroll: 1,
    //                        infinite: true,
    //                        dots: true
    //                    }
    //                }, {
    //                    breakpoint: 480,
    //                    settings: {
    //                        slidesToShow: 2,
    //                        slidesToScroll: 1
    //                    }
    //                }]
    //            });
    //        }
    //    }
    //});

    //angular.module('app').directive('subcribleInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            element.subscribeBetter({
    //                trigger: "onload",
    //                delay: 300
    //            });
    //        }
    //    }
    //});

    //angular.module('app').directive('backToTopInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            element.on("click", function () {
    //                $('body,html').animate({
    //                    scrollTop: 0
    //                }, 2000);
    //                return false;
    //            });
    //        }
    //    }
    //});

    //angular.module('app').directive('modalOwlCarouselInit', function () {
    //    return {
    //        // Restrict it to be an attribute in this case
    //        restrict: 'A',
    //        // responsible for registering DOM listeners as well as updating the DOM
    //        link: function (scope, element, attrs) {
    //            var sync1 = $(".sync1");
    //            var sync2 = $(".sync2");

    //            sync1.owlCarousel({
    //                singleItem: true,
    //                slideSpeed: 1000,
    //                navigation: true,
    //                pagination: false,
    //                afterAction: syncPosition,
    //                responsiveRefreshRate: 200,
    //                navigationText: [
    //                    "<i class='fa fa-chevron-left'></i>",
    //                    "<i class='fa fa-chevron-right'></i>"
    //                ]
    //            });

    //            sync2.owlCarousel({
    //                items: 4,
    //                itemsDesktop: [1199, 4],
    //                itemsDesktopSmall: [979, 3],
    //                itemsTablet: [768, 3],
    //                itemsMobile: [479, 2],
    //                pagination: false,
    //                responsiveRefreshRate: 100,
    //                afterInit: function (el) {
    //                    el.find(".owl-item").eq(0).addClass("synced");
    //                }
    //            });

    //            function syncPosition(el) {
    //                var current = this.currentItem;
    //                $(".sync2")
    //                        .find(".owl-item")
    //                        .removeClass("synced")
    //                        .eq(current)
    //                        .addClass("synced")
    //                if ($(".sync2").data("owlCarousel") !== undefined) {
    //                    center(current)
    //                }
    //            }

    //            $(".sync2").on("click", ".owl-item", function (e) {
    //                e.preventDefault();
    //                var number = $(this).data("owlItem");
    //                sync1.trigger("owl.goTo", number);
    //            });

    //            function center(number) {
    //                var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
    //                var num = number;
    //                var found = false;
    //                for (var i in sync2visible) {
    //                    if (num === sync2visible[i]) {
    //                        var found = true;
    //                    }
    //                }

    //                if (found === false) {
    //                    if (num > sync2visible[sync2visible.length - 1]) {
    //                        sync2.trigger("owl.goTo", num - sync2visible.length + 2)
    //                    } else {
    //                        if (num - 1 === -1) {
    //                            num = 0;
    //                        }
    //                        sync2.trigger("owl.goTo", num);
    //                    }
    //                } else if (num === sync2visible[sync2visible.length - 1]) {
    //                    sync2.trigger("owl.goTo", sync2visible[1])
    //                } else if (num === sync2visible[0]) {
    //                    sync2.trigger("owl.goTo", num - 1)
    //                }

    //            }
    //        }
    //    }
    //});
    
})();
