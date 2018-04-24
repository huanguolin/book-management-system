'use strict';

angular.module('bookList', [])

.component('bookList', {
    templateUrl: 'book-list/template.html',
    controller: [
        '$resource', 
        function BookListController ($resource) {
            var self = this;
            var Book = $resource('/api/books');
            self.books = [];
            Book.get({}, function (res) {
                self.books = res.list;
            });
        }
    ]
});