'use strict';

// Declare app level module which depends on views, and components
angular.module('booksApp', [
    'ngRoute',
    'ngResource',
    'bookList'
])
    
.config([
    '$locationProvider', 
    '$routeProvider', 
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/books', {
                template: '<book-list></book-list>'
            }).
            // when('/book/:id', {
            //    template: '<book-detail></book-detail>'
            // }).
            otherwise('/books'); 
    }
]);
