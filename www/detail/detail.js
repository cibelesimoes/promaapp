'use strict'
angular.module('starter.detail', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('detail',{
        url: '/detail',
        templateUrl: 'detail/detail.html',
        controller: 'DetailCtrl'
    });
}])