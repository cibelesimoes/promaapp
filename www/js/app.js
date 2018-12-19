'use strict'
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db;

var app = angular.module('starter', [
  'ionic',
  'starter.signin',
  'starter.home',
  'starter.signup',
  'starter.menu',
  'starter.newpost',
  'starter.detail',
  'ngCordova'
  ])

app.value('activeUser', {
        id:'',
        name:'',
        email:'',
        username:'',
        password:'',
        avatar:'',
        created:''
    })

.run(function($ionicPlatform, $cordovaSQLite, $rootScope, activeUser) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    // db = $cordovaSQLite.openDB("my.db");
    if(window.cordova) {
      // db = $cordovaSQLite.openDB('my.db', 1);
      db = $cordovaSQLite.openDB({name: "myproma.db",  location: 'default'});
    } else {
      db = window.openDatabase('myproma', '1.0', 'myproma.db', 100 * 1024 * 1024);
    }
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name text NOT NULL,email text NOT NULL,username text NOT NULL,password text NOT NULL,avatar text NOT NULL,created TIME_STAMP)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, message text NULL, username text NOT NULL, picture text NULL, productname text NULL, productprice real NULL, posted timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS postlikes (id INTEGER PRIMARY KEY AUTOINCREMENT, id_post INTEGER NOT NULL, likes INTEGER NOT NULL, username text NOT NULL, liked timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_post) REFERENCES posts(id))');
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS postreports (id INTEGER PRIMARY KEY AUTOINCREMENT, id_post INTEGER NOT NULL, reports INTEGER NOT NULL, username text NOT NULL, reported timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(id_post) REFERENCES posts(id))');

});
})
app.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider,$httpProvider){
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.views.maxCache(0);
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $urlRouterProvider.otherwise('/signin');//se a url for invalida, vai para main

});
