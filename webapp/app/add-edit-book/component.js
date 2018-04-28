'use strict';

angular.module('addEditBook', ['ngRoute'])

.directive('coverSelect', function() {
    return {
        restrict: 'E',
        template: '<input type="file" accept="image/png,image/jpg,image/jpeg" style="display: none"/>',
        replace: true,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var listener = function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(element[0].files[0]);
                });
            }
            element.bind('change', listener);
        }
    }
})

.component('addEditBook', {
    templateUrl: 'add-edit-book/template.html',
    controller: [
        '$rootScope',
        '$scope',
        '$route',
        '$timeout',
        function addEditBookController ($rootScope, $scope, $route, $timeout) { 
            var addBook = $rootScope.api.addBook;
            var updateBook = $rootScope.api.updateBook;
            var uploadCover = $rootScope.api.uploadCover;
            var id = $route.current.params.id;

            // init data 
            $scope.action = id ? 'edit' : 'add';
            $scope.book = {
                name: '',
                author: '',
                description: '',
            };
            $scope.cover = 'img/default_book_cover.jpg';
            $scope.coverFile = null;

            if ($scope.action === 'edit') {
                var oldBook = $rootScope.book.info;
                $scope.book = {
                    name: oldBook.name,
                    author: oldBook.author,
                    description: oldBook.description,
                };
                if (oldBook.cover) {
                    $scope.cover = oldBook.cover;
                } 
            } 

            $scope.submit = function (e) {
                e.preventDefault();

                // validate params
                if (!$scope.book.name || !$scope.book.author) {
                    var feild = !$scope.book.name ? 'Name' : 'Author'; 
                    alert(feild + ' is required');
                    return;
                }
                if ($scope.cover === 'img/default_book_cover.jpg') {
                    $scope.book.cover = '';
                } else {
                    $scope.book.cover = $scope.cover ;
                }

                // do real thing 
                if ($scope.action === 'add') {
                    addBook($scope.book, function (res) {
                        alert('add book successfully!');
                        window.location.hash = '#!/books';
                    });
                } else {
                    $scope.book.id = id;
                    updateBook($scope.book, function (res) {
                        alert('update book successfully!');
                        $rootScope.back();
                    });
                }
            };
            $scope.uploadClick = function () {
                // trigger input click 
                $timeout(function () {
                    $('input[type="file"]').trigger('click');
                }, 0);
            };
            // $scope.uploadCover = function () {
            //     // file changed and upload it 
            //     uploadCover(e.files[0], function (res) {
            //         $scope.cover = res.coverPath;
            //     });
            // };
            $scope.$watch('coverFile', function (val) {
                if (!val) return;

                // file changed and upload it 
                uploadCover(val, function (res) {                    
                    $scope.cover = res.coverPath;
                });
            });
        }
    ]
});
