
var state = {};
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'chat', 'socket.io'])

.run(function($ionicPlatform, $state, $rootScope, $stateParams) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //Debug code to have access to state
    state = $state;
    $rootScope.$state = $state;

    $rootScope.$stateParams = $stateParams;
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://www.nickbolles.com/**', 'http://localhost:63342/**', 'http://localhost:8080/**', 'http://localhost:8080/gpabot/userdata', 'http://localhost:8081/**', 'http://localhost:8081/login','http://localhost:8080/gpabot/userdata']);
  $stateProvider

  .state('start', {
    url: "/start",
    templateUrl: "templates/start.html",
    controller: "StartCtrl"
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.chat', {
      url: "/chat",
      views: {
        'menuContent': {
          templateUrl: "templates/chat.html",
          controller: 'ChatCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/chat');
})

.factory('socket', function (socketFactory) {
  var myIoSocket = io.connect('localhost:8084');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});