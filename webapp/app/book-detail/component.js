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
            var removeBook = $rootScope.api.removeBook;
            var getCurBook = function (index) {
                getBooks(function (res) {
                    var bookInfo = res.list[0]; 
                    var cover = bookInfo.cover;     
                    bookInfo.cover = cover ? 'img/cover/' + cover : 'img/default_book_cover.jpg';  
                    
                    // update scope property
                    $scope.currentBook = bookInfo;  
                    
                    // update page total
                    $rootScope.page.current = index;
                    $rootScope.page.total = res.totalPage;
                    
                    // update book info
                    $rootScope.book.current = index;
                    $rootScope.book.total = res.totalPage;
                    $rootScope.book.info = bookInfo;
                }, { 
                    page: index, 
                    pageSize: PAGE_SIZE, 
                });
            };

            // init 
            $scope.currentBook = {}; 
            $rootScope.page.current = $rootScope.book.current; // trigger the watch to update current book info
            $scope.removeBook = function () {
                // warning user
                var msg = 'Are you sure to remove this book infomation?';  
                if (!window.confirm(msg)) {
                    return;
                }

                // remove 
                removeBook($scope.currentBook.id, function () {
                    alert('remove book successfully!'); 

                    if ($rootScope.book.total <= 1) {
                        // go to books page when no book after remove
                        window.location.hash = '#!/books';
                    } else {
                        // get and show current index book
                        var curIndex = $rootScope.book.current;
                        if (curIndex === $rootScope.book.total) {
                            curIndex--;
                        }
                        getCurBook(curIndex);
                    }         
                });
            };

            // update 
            $scope.$watch(function () {
                return $rootScope.page.current;
            }, function (val) {
                getCurBook(val);
            });            
        }
    ]
});
