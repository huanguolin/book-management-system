'use strict';

angular.module('addEditBook', ['ngRoute'])

.component('addEditBook', {
    templateUrl: 'add-edit-book/template.html',
    controller: [
        '$rootScope',
        '$scope',
        '$route',
        function addEditBookController ($rootScope, $scope, $route) { 
            var id = $route.current.params.id;
            $scope.action = id ? 'edit' : 'add';

            if ($scope.action === 'edit') {
                var oldBook = $rootScope.book.info;
                $scope.book = {
                    name: oldBook.name,
                    author: oldBook.author,
                    description: oldBook.description,
                };
            } else {
                $scope.book = {
                    name: '',
                    author: '',
                    description: '',
                };
            }

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

        }
    ]
});
