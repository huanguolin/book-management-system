'use strict';

angular.module('bookDetail', [])

.component('bookDetail', {
    templateUrl: 'book-detail/template.html',
    controller: [
        '$rootScope',
        '$scope',
        function bookDetailController ($rootScope, $scope) {        
            var PAGE_SIZE = 1;
            var getBooks = $rootScope.api.getBooks;

            // init 
            var self = this;
            $scope.currentBook = {}; 
            $rootScope.page.current = $rootScope.book.current; // trigger the watch to update current book info

            // update 
            $scope.$watch(function () {
                return $rootScope.page.current;
            }, function (val) {
                getBooks(function (res) {
                    var bookInfo = res.list[0]; 
                    var cover = bookInfo.cover;     
                    bookInfo.cover = cover ? 'img/cover/' + cover : 'img/default_book_cover.jpg';            
                    $scope.currentBook = bookInfo;                    
                    $rootScope.page.total = res.totalPage;
                }, { 
                    page: val, 
                    pageSize: PAGE_SIZE, 
                });
            });            
        }
    ]
});
