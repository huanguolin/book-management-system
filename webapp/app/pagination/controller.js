'use strict';

angular
.module('booksApp')
.controller('PaginationController', ['page', function (page) {
    this.page = page;
}]);
