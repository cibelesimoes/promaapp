'use strict'
angular.module('starter.menu', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('menu',{
        url: '/menu',
        templateUrl: 'profile/profile.html',
        controller: 'MenuCtrl',
        abstract: true
    });
}])

.controller('MenuCtrl', ['$scope', '$state', '$cordovaSQLite', '$ionicHistory', '$ionicPlatform', function($scope, $state, $cordovaSQLite, $ionicHistory, $ionicPlatform){
    $scope.Logout = function () {
        $state.go('signin');
    }

    $scope.NewPost = function () {
        $state.go('newpost');
    }

    $scope.Mensagem = function(){
        swal(
            'Versão 1.0',
            'Tem alguma sugestão? Me mande um email cibelesimoesoliveira@gmail.com. Obrigada por colaborar :)',
            'success'
            )
    }
}])