'use strict'
angular.module('starter.newpost', [])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('newpost',{
        url: '/newpost',
        templateUrl: 'newpost/newpost.html',
        controller: 'NewPostCtrl',
        abstract: true
    });

}])

.controller('NewPostCtrl', ['$scope', '$state', '$cordovaSQLite', '$ionicHistory', '$ionicPlatform','$cordovaCamera','$http', 'activeUser','$window','$cordovaGeolocation', function($scope, $state, $cordovaSQLite, $ionicHistory, $ionicPlatform, $cordovaCamera,$http, activeUser,$window,$cordovaGeolocation){
   
   $scope.savePost = function (post) {

    if(post != null){
        post['picture'] = $scope.imgURI;
        var username = activeUser.username;
        console.log("esse é o username " + username);
        post['username'] = username;
        var query = "INSERT INTO posts (message, username, picture, productname, productprice, posted) VALUES (?,?,?,?,?,DATETIME())";
        $cordovaSQLite.execute(db, query, [post.message, post.username, post.picture, post.productname, post.productprice]).then(function(res) {
            $scope.postarWebService(post);
            console.log("INSERT ID -> " + res.insertId);
            console.log("Objeto: " + res);
            $state.go('menu.home');
        }, function (err) {
            console.error(err);
        });
       }
       else{
            swal("Ops! Que tal colocar algumas informações?");
       }
    }

    $scope.postarWebService = function(post) {
        post.posted = new Date().toISOString();
        $http({
            method: "POST",
            url: "http://promaws-tcc.esy.es/posts", 
            data: post,
            headers: {"Content-type": "application/json"}
        })
        .then (function(response){
            console.log("deu certo, será?: " + JSON.stringify(response));
        }).then(function(response){
            console.log("deu ruim: " + JSON.stringify(response));
        });
    }


  $scope.takePicture = function(source)
    {
        var options = { 
            quality : 85, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : source,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 180,
            targetHeight: 180,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            //$scope.imgURI = imageData;
             $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }

    $scope.listarPostsWebService = function() {
        $http({
            method: "GET",
            url: "http://promaws-tcc.esy.es/posts", 
            headers: {"Content-type": "application/json"}
        })
        .then (function(response){
            var lista = response.data;
            for(var i = 0; i < lista.length; i++){
                console.log(lista[i].id);
            }
            console.log(response);
        }).then(function(response){
            console.log("deu ruim: " + JSON.stringify(response));
        });
    }

$scope.getCurrentPosition = function(){

        $window.navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$apply(function() {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
            var request = {
                latLng: latlng
            };

            geocoder.geocode(request, function(data, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                if (data[0] != null) {
                    $scope.txtAdress = data[0].formatted_address;
                    if($scope.post){
                        $scope.post.message = data[0].formatted_address;
                    }
                    else{
                        $scope.post = {};
                        $scope.post.message = data[0].formatted_address;
                    }
                    console.log("address is: " + data[0].formatted_address);
                } else {
                    alert("Localização indisponível!");
                    console.log("No address available");
                }
                }
            })
            console.log(position);
            })
        });
    }

    $scope.getCurrentPosition();
     $scope.getCurrentPosition();

}])
