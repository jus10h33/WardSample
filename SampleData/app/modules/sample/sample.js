(function () {
    'use strict';

    angular
        .module("mainApp")
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app.sample', {
                    url: 'sample',
                    views: {
                        '@': {
                            templateUrl: '/app/modules/sample/sample.html'
                        }
                    }
                })
                .state('app.sample.find1', {
                    url: '/find',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    resolve: {
                        PreviousState: ["$state", function ($state) {
                            var currentStateData = {
                                Name: $state.current.name,
                                Params: $state.params,
                                URL: $state.href($state.current.name, $state.params)
                            };
                            return currentStateData;
                        }]
                    },
                    controller: 'CRUDController'
                })
                .state('app.sample.find2', {
                    url: '/find/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'findController'
                })
                .state('app.sample.add', {
                    url: '/add',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    resolve: {
                        PreviousState: ["$state", function ($state) {
                            var currentStateData = {
                                Name: $state.current.name,
                                Params: $state.params,
                                URL: $state.href($state.current.name, $state.params)
                            };
                            return currentStateData;
                        }]
                    },
                    controller: 'CRUDController'
                })
                .state('app.sample.update', {
                    url: '/update',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    resolve: {
                        PreviousState: ["$state", function ($state) {
                            var currentStateData = {
                                Name: $state.current.name,
                                Params: $state.params,
                                URL: $state.href($state.current.name, $state.params)
                            };
                            return currentStateData;
                        }]
                    },
                    controller: 'CRUDController'
                })
                .state('app.sample.delete', {
                    url: '/delete',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    resolve: {
                        PreviousState: ["$state", function ($state) {
                            var currentStateData = {
                                Name: $state.current.name,
                                Params: $state.params,
                                URL: $state.href($state.current.name, $state.params)
                            };
                            return currentStateData;
                        }]
                    },
                    controller: 'CRUDController'
                })
                .state('app.sample.previous1', {
                    url: '/previous',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'ScrollController'
                })
                .state('app.sample.previous2', {
                    url: '/previous/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'SetScopeController'
                })
                .state('app.sample.next1', {
                    url: '/next',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'ScrollController'
                })
                .state('app.sample.next2', {
                    url: '/next/:stn/:bn/:ln',
                    templateUrl: '/app/modules/sample/entry/entry.html',
                    controller: 'SetScopeController'
                })
        })
})();