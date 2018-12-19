'use strict'
angular.module('starter.home', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('menu.home',{
        url: '/home',
        views: {
            'side-menu': {
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            }
        }
    });
    $stateProvider.state('menu.newpost',{
        url: '/newpost',
        views: {
            'side-menu': {
                templateUrl: 'newpost/newpost.html',
                controller: 'NewPostCtrl'
            }
        }
    });
}])


.controller('HomeCtrl', ['$scope', '$state', '$cordovaSQLite', '$ionicHistory', '$ionicPlatform','$http','$filter','activeUser','$window', function($scope, $state, $cordovaSQLite, $ionicHistory, $ionicPlatform, $http, $filter,activeUser,$window){
    
 $scope.allPosts = [];

   $scope.listarPostsWebService = function() {
        $http({
            method: "GET",
            url: "http://promaws-tcc.esy.es/posts", 
            headers: {"Content-type": "application/json"}
        })
        .then (function(res){
            var lista = res.data;
         {
            for(var i = 0; i < lista.length; i++){
                lista[i].posted = new Date(lista[i].posted);
                $scope.allPosts.push(lista[i]);
                
                console.log(lista[i].id + " -> " + lista[i].message);
            }
        }
        }).then(function(res){
            console.log("deu ruim: " + JSON.stringify(res));
        });
    }

    $scope.Order = function(order) {
            
            if (order == '0') {
            $scope.allPosts = $filter('orderBy')($scope.allPosts, 'productname');
            } else if(order == '1'){
                $scope.allPosts = $filter('orderBy')($scope.allPosts, 'productprice');
            }else {
                $scope.allPosts = $filter('orderBy')($scope.allPosts, 'id');
            }
   }

    $scope.listarPostsWebService();

   $scope.likeNoPost = function(post) {
        var soma = eval(post.likes) + 1;
        post.likes = soma; 
    }

    $scope.Logout = function () {
        $state.go('signin');
    }

    $scope.init = function () {
        $ionicHistory.removeBackView();
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    };

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
                        console.log('Nome do usuário ativo na home: ' + activeUser.name + ' email do usuário ativo: ' + activeUser.email);
                    }
                }, function(error){
                    console.error(error);
                });
    });


    $scope.postarLikesWebService = function(postlike) {
        postlike['liked'] = new Date().toISOString();
        postlike['likes'] = 1; 
        $http({
            method: "POST",
            url: "http://promaws-tcc.esy.es/postlikes", 
            data: postlike,
            headers: {"Content-type": "application/json"}
        })
        .then (function(response){
            console.log("deu certo, será?: " + JSON.stringify(response));
        }).then(function(response){
            console.log("deu ruim: " + JSON.stringify(response));
        });
    }

   $scope.saveLike = function (postlike,post) {
       if (postlike != null) {
           var username = activeUser.username;

           var query1 = "SELECT id FROM postlikes WHERE username='" + username + "' AND id_post='" + postlike.id_post + "'";
           $cordovaSQLite.execute(db, query1, []).then(function (res) {
               if (res.rows.length > 0) {
                   $state.go('menu.home');
                   swal("Você já deu like neste post!");
               } else {
                   console.log(postlike.id_post);
                   postlike['username'] = username;
                   var query = "INSERT INTO postlikes (id_post, likes, username, liked) VALUES (?,?,?,DATETIME())";
                   $cordovaSQLite.execute(db, query, [postlike.id_post, 1, postlike.username]).then(function (res) {
                       $scope.postarLikesWebService(postlike);
                    //    var curtidas = document.getElementById("qtdelikes_"+postlike.id_post);
                    //    $scope.post.qtde_likes = parseInt(curtidas.innerHTML) + 1;
                     $scope.likeNoPost(post);
                       console.log("POSTLIKE Inserido ID -> " + res.insertId);
                       console.log("Objeto: " + res);
                       $scope.listarPostsWebService();
                       $state.go('menu.home');
                   }, function (err) {
                       console.error(err);
                   });
               }
           }, function (err) {
                       console.error(err);
                   }); 
        }
    }

    $scope.postarReportsWebService = function(postreport) {
        postreport['reported'] = new Date().toISOString();
        postreport['reports'] = 1; 
        $http({
            method: "POST",
            url: "http://promaws-tcc.esy.es/postreports", 
            data: postreport,
            headers: {"Content-type": "application/json"}
        })
        .then (function(response){
            console.log("deu certo, será?: " + JSON.stringify(response));
        }).then(function(response){
            console.log("deu ruim: " + JSON.stringify(response));
        });
    }

   $scope.saveReport = function (postreport) {
       if (postreport != null) {
           var username = activeUser.username;

           var query1 = "SELECT id FROM postreports WHERE username='" + username + "' AND id_post='" + postreport.id_post + "'";
           $cordovaSQLite.execute(db, query1, []).then(function (res) {
               if (res.rows.length > 0) {
                   $state.go('menu.home');
                   swal("Você já reportou esse post!");
               } else {
                   console.log(postreport.id_post);
                   postreport['username'] = username;
                   var query = "INSERT INTO postreports (id_post, reports, username, reported) VALUES (?,?,?,DATETIME())";
                   $cordovaSQLite.execute(db, query, [postreport.id_post, 1, postreport.username]).then(function (res) {
                       $scope.postarReportsWebService(postreport);
                       console.log("POSTREPORT Inserido ID -> " + res.insertId);
                       console.log("Objeto: " + res);
                       $scope.listarPostsWebService();
                       $state.go('menu.home');
                   }, function (err) {
                       console.error(err);
                   });
               }
           }, function (err) {
                       console.error(err);
                   }); 
        }
    }

}])
