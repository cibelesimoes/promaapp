'use strict'
angular.module('starter.signup', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('signup',{
        url: '/signup',
        templateUrl: 'signup/signup.html',
        controller: 'SignUpCtrl'
    });
}])

.controller('SignUpCtrl', ['$scope', '$state', '$cordovaSQLite', function($scope, $state, $cordovaSQLite){
    
     $scope.ExisteUsuario = function(user) {
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
    
    $scope.signIn = function () {
        $state.go('signin');
    }

    $scope.Signup = function (isValid,user) {
        if (isValid) {
            console.log("passou aqui");
            var query = "INSERT INTO users (name, email, username, password, avatar, created) VALUES (?,?,?,?,?,DATETIME())";
            $cordovaSQLite.execute(db, query, [user.name, user.email, user.username, user.password, ""]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                console.log("Objeto: " + res);
                $state.go('signin');
            }, function (err) {
                console.error(err);
            });
        }if(!isValid){
            swal("Ei, você tem que preencher todos os campos :)");
        }
    }
}])
