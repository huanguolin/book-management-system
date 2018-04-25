'use strict';

angular.module('bookList', [
    'ngResource',
    'core.page',
])

.component('bookList', {
    templateUrl: 'book-list/template.html',
    controller: [
        '$resource',
        'page',
        function BookListController ($resource, page) {
            var self = this;
            var Book = $resource('/api/books');
            self.books = [];
            
            Book.get({}, function (res) {
                self.books = res.list;

                console.log('page:', page);
                page.current = 1;
                page.total = res.totalPage;
                console.log('page:', page);
            });
        }
    ]
});