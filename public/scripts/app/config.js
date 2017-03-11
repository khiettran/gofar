// put your config code here
(function() {
    'use strict';
    angular.module("app").config(['$translateProvider', function ($translateProvider) {
        $translateProvider
            .translations('vi', translationsVI)
            .preferredLanguage('vi')
            .useSanitizeValueStrategy('sanitize');
    }]);
})();