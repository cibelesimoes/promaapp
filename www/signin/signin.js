'use strict'
angular.module('starter.signin', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('signin',{
        url: '/signin',
        templateUrl: 'signin/signin.html',
        controller: 'LoginCtrl'
    });
}])

.controller('LoginCtrl', ['$scope', '$state', '$cordovaSQLite', '$ionicHistory', '$ionicPlatform','activeUser', function($scope, $state, $cordovaSQLite, $ionicHistory, $ionicPlatform,activeUser){
    $scope.Logar = function(user) {
        var query = "SELECT username FROM users WHERE email='"+user.email+"' AND password='"+user.password+"'";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length>0){
                $state.go('menu.home');
            }
            else{
                //alert("Usuário Inválido!");
                swal("Usuário Inválido!");
            }
        }, function (err) {
            console.error(err);
        });
    }
    
    $scope.Registrar = function() {
        $state.go('signup');
    }

    $scope.init = function () {
        $ionicHistory.removeBackView();
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $ionicPlatform.ready(function(){
        $scope.init();
    });

    $scope.$on("$ionicView.enter", function(event, data){
            $cordovaSQLite.execute(db,'SELECT id, name, email, username, password, avatar, created FROM users LIMIT 1',[]).then( function(res){
                    if (res.rows.length>0){
                        activeUser.id = res.rows.item(0).id;
                        activeUser.name = res.rows.item(0).name;
                        activeUser.email = res.rows.item(0).email;
                        activeUser.username = res.rows.item(0).username;
                        activeUser.password = res.rows.item(0).password;
                        activeUser.avatar = res.rows.item(0).avatar;
                        activeUser.created = res.rows.item(0).created;
                        console.log('Nome do usuário ativo no signin: ' + activeUser.name + 'email do usuário ativo: ' + activeUser.email);
                        $state.go('menu.home');
                    }
                }, function(error){
                    console.error(error);
                });
        console.log("State Params: ", data.stateParams);
    });
}])