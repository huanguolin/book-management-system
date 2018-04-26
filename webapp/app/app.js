'use strict';

// Declare app level module which depends on views, and components
angular.module('booksApp', [
    'ngRoute',    
    'ngResource',
    'bookList',
    'bookDetail'
])

// Declare global property
.run([
    '$rootScope', 
    '$resource',
    function ($rootScope, $resource) {

        $rootScope.page = {
            current: 1,
            total: 1,
        };
        $rootScope.book = {
            current: 1,
            total: 1,
        };

        $rootScope.api = {        
            getBooks: function (cb, query) {
                var PAGE = 1;
                var PAGE_SIZE = 10;

                var Book = $resource('/api/books');
                
                var query = {
                    page: query && query.page || PAGE, 
                    page_size: query && query.pageSize || PAGE_SIZE,
                };
                Book.get(query, cb);
            }
        };
    }
])

// Declare global route
.config([
    '$locationProvider', 
    '$routeProvider', 
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/books', {
                template: '<book-list></book-list>'
            }).
            when('/book/:id', {
               template: '<book-detail></book-detail>'
            }).
            otherwise('/books'); 
    }
]);
