'use strict';

angular.module('bookList', [])

.component('bookList', {
    templateUrl: 'book-list/template.html',
    controller: [
        '$rootScope',
        '$scope',
        function BookListController ($rootScope, $scope) {            
            var PAGE_SIZE = 5;
            var getBooks = $rootScope.api.getBooks;

            // init
            $scope.books = [];   
            $scope.updateGlobalBookInfo = function (index) {
                var currentPage = $rootScope.page.current;
                // update global book info (note: index start from 0)
                $rootScope.book.current = (currentPage - 1) * PAGE_SIZE + index + 1; 
            };
            // trigger the watch to update current page info
            $rootScope.page.current = 1; 

            // update 
            $scope.$watch(function () {
                return $rootScope.page.current;
            }, function (val) {
                getBooks(function (res) {   
                    // update books               
                    $scope.books = res.list.map(function (b) {
                        b.cover = b.cover ? 'img/cover/' + b.cover : 'img/default_book_cover.jpg';  
                        return b;
                    });

                    // update global info
                    $rootScope.page.total = res.totalPage;
                    $rootScope.book.total = res.total;
                }, { 
                    page: val, 
                    pageSize: PAGE_SIZE 
                });
            });
        }
    ]
});
