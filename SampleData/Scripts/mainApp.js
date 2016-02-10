angular.module("mainApp", ["ui.router"])
.constant("regNumeric", new RegExp("^[0-9]+$"))
.constant("regBatch", new RegExp('20(0[6-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])'))
.constant("regDate", new RegExp('^20(0[7-9]|[1-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$'))
.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('sampleEntry', {
        url: '/',
        views: {
            'sampleInfo': {
                templateUrl: 'Content/templates/partials/sampleInfo.html'
            },
            'notes': {
                templateUrl: 'Content/templates/partials/notes.html'
            },
            'discardChanges': {
                templateUrl: 'Content/templates/partials/discardChanges.html'
            }
        },
        controller: 'defaultSampleCtlr'
    })
    .state('sampleEntry.find', {
        url: 'find',
        views: {
            'sampleInfo@': {
                template: '<h1>find</h1>',
                controller: function () {

                }
            }
        }
    })
    .state('sampleEntry.find.sample', {
        url: '/:stn/:bn/:ln',
        views: {
            'entry@': {
                template: '<h1>find sample</h1>',
                controller: 'findSampleCtlr'
            }
        }
    })
    .state('sampleEntry.next', {
        url: 'next/:stn/:bn/:ln',
        views: {
            'entry@': {
                template: '<h1>next</h1>',
                controller: 'nextSampleCtlr'
            }
        }
    })
    .state('sampleEntry.prev', {
        url: 'prev/:stn/:bn/:ln',
        views: {
            'entry@': {
                template: '<h1>prev</h1>',
                controller: 'prevSampleCtlr'
            }
        }
    })
    .state('sampleEntry.add', {
        url: 'add',
        views: {
            'entry@': {
                template: '<h1>add</h1>',
                controller: 'addSampleCtlr'
            }
        }
    })
    .state('sampleEntry.update', {
        url: 'update',
        views: {
            'entry@': {
                template: '<h1>update</h1>',
                controller: 'updateSampleCtlr'
            }
        }
    })
    .state('sampleEntry.delete', {
        url: 'delete/:stn/:bn/:ln',
        views: {
            'entry@': {
                template: '<h1>delete</h1>',
                controller: 'deleteSampleCtlr'
            }
        }
    });
})
.controller("mainCtrl", function ($scope, $http, $filter) {

});