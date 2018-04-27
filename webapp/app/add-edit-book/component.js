'use strict';

angular.module('addEditBook', ['ngRoute'])

.component('addEditBook', {
    templateUrl: 'add-edit-book/template.html',
    controller: [
        '$rootScope',
        '$scope',
        '$route',
        '$timeout',
        function addEditBookController ($rootScope, $scope, $route, $timeout) { 
            var id = $route.current.params.id;
            $scope.action = id ? 'edit' : 'add';

            if ($scope.action === 'edit') {
                var oldBook = $rootScope.book.info;
                $scope.book = {
                    name: oldBook.name,
                    author: oldBook.author,
                    description: oldBook.description,
                };
                $scope.cover = oldBook.cover ? oldBook.cover : 'img/default_book_cover.jpg';
            } else {
                $scope.book = {
                    name: '',
                    author: '',
                    description: '',
                };
                $scope.cover = 'img/default_book_cover.jpg';
            }
            $scope.newCover = '';

            $scope.submit = function (e) {
                e.preventDefault();

                if (!$scope.book.name || !$scope.book.author) {
                    var feild = !$scope.book.name ? 'Name' : 'Author'; 
                    alert(feild + ' is required');
                    return;
                }

                if ($scope.action === 'add') {
                    $rootScope.api.addBook($scope.book, function (res) {
                        alert('add book successfully!');
                        window.location.hash = '#!/books';
                    });
                } else {
                    $scope.book.id = id;
                    $rootScope.api.updateBook($scope.book, function (res) {
                        alert('update book successfully!');
                        $rootScope.back();
                    });
                }
            };
            $scope.uploadClick = function () {
                $timeout(function () {
                    angular.element('#coverUpload').trigger('click');
                }, 0);
            };
            $scope.uploadCover = function () {
                console.log('files:', $scope.newCover);
            };
        }
    ]
});
