'use strict';

angular.module('core.page', [])

.factory('page', function () {
    return {
        current: -1,
        total: -1,
    };
});