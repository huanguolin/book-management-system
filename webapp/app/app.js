import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';


// Declare app level module which depends on views, and components
angular.module('booksApp', [
    'ngRoute',    
    'ngResource',
    'bookList',
    'bookDetail',
    'addEditBook',
])

// Declare global property
.run([
    '$rootScope', 
    '$resource',
    '$location',
    function ($rootScope, $resource, $location) {

        $rootScope.page = {
            current: 1,
            total: 1,
            show: false,
        };

        var KEY = {
            BOOK_CURRENT: 'book.current',
            BOOK_TOTAL: 'book.total',
            BOOK_INFO: 'book.info',
        };
        $rootScope.book = {};
        Object.defineProperties($rootScope.book, {
            current: {
                set: function (v) {
                    localStorage.setItem(KEY.BOOK_CURRENT, JSON.stringify(v));
                },
                get: function () {
                    var v = localStorage.getItem(KEY.BOOK_CURRENT);
                    v = v ? JSON.parse(v) : 1;
                    return v;
                }
            },
            total: {
                set: function (v) {
                    localStorage.setItem(KEY.BOOK_TOTAL, JSON.stringify(v));
                },
                get: function () {
                    var v = localStorage.getItem(KEY.BOOK_TOTAL);
                    v = v ? JSON.parse(v) : 1;
                    return v;
                }
            },
            info: {
                set: function (v) {
                    localStorage.setItem(KEY.BOOK_INFO, JSON.stringify(v));
                },
                get: function () {
                    var v = localStorage.getItem(KEY.BOOK_INFO);
                    v = v ? JSON.parse(v) : {};
                    return v;
                }
            },
        });

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
            },
            addBook: function (book, cb) {
                var Book = $resource('/api/book');
                Book.save({}, book, cb);
            },
            updateBook: function (book, cb) {
                var Book = $resource('/api/book/:id', 
                    { id: '@id'},
                    {
                        'update': { method: 'PATCH' }
                    });
                Book.update({id: book.id}, book, cb);
            },
            removeBook: function (id, cb) {
                var Book = $resource('/api/book/:id', { id: '@id'});
                Book.remove({id: id}, cb);
            },
            uploadCover: function (file, cb) {
                var CoverImg = $resource('/api/cover/upload', null, {
                    'save': {
                        method: 'POST',
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/json'
                        },
                        transformRequest: function (data, headerGetter) {
                            var headers = headerGetter();
                            headers['Content-Type'] = undefined;

                            if (!data) {
                                return data;
                            }

                            var formData = new FormData();
                            formData.append('coverFile', file);

                            return formData;
                        }
                    }
                });
                CoverImg.save(file, cb);
            },
        };

        $rootScope.$watch(function () {
            return $location.path();
        }, function (val) {
            // only show page when route path is:
            // /books
            // /book
            var pattern = /^\/books?$/; 
            $rootScope.page.show = pattern.test(val);
        });


        /* route history */
        var history = [];

        $rootScope.$on('$routeChangeSuccess', function() {
            history.push($location.$$path);
            if (history.length > 20) history.shift();
        });

        $rootScope.back = function () {
            var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
            $location.path(prevUrl);
        };
    }
])

// Declare global route
.config([
    '$locationProvider', 
    '$routeProvider', 
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/books', {
                template: '<book-list></book-list>'
            })
            .when('/book', {
               template: '<book-detail></book-detail>'
            })
            .when('/addbook', {
                template: '<add-edit-book></add-edit-book>'
            })
            .when('/editbook/:id', {
                template: '<add-edit-book></add-edit-book>'
            })
            .otherwise('/books'); 
    }
])

// Declare global filters
.filter('capitalize', function() {
    return function(input) {
        input = input || '';
        return input && (input.charAt(0).toUpperCase() + input.slice(1));
    };
})
.filter('ts2time', function() {
    return function(ts) {
        if (!ts) return;

        var time = new Date(parseInt(ts));
        var y = time.getFullYear();
        var m = time.getMonth() + 1; // month start from 0
        var d = time.getDate();
        var h = time.getHours();
        var min = time.getMinutes();
        var s = time.getSeconds();
        
        return [y, m, d].join('/') + ' ' + [h, min, s].join(':');
    };
});