angular.module('cirrusSounds', ['app.controllers', 'app.directives', 'app.filters', 'app.services', 'ui.router', 'satellizer'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'AuthCtrl'
    })
    .state('trending', {
      url: '/',
      templateUrl: 'trending.html',
      controller: 'NavCtrl'
    })
    .state('trending.today', {
      url: 'today',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'day'};
        }
      }
    })
    .state('trending.week', {
      url: 'this-week',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'week'};
        }
      }
    })
    .state('trending.month', {
      url: 'this-month',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'month'};
        }
      }
    })
    .state('trending.allTime', {
      url: 'all-time',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'allTime'};
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}])

.config(['$authProvider', 'clientId', function($authProvider, clientId) {

  $authProvider.oauth2({
    name: 'soundcloud',
    url: '/auth/soundcloud',
    clientId: clientId,
    redirectUri: window.location.origin,
    authorizationEndpoint: 'https://soundcloud.com/connect'
  });

  $authProvider.oauth2({
    name: 'foursquare',
    url: '/auth/foursquare',
    clientId: 'HXZHJJQ5YBDB3EHTDKDLWOLNWKW12X4E3XOTN302TUSTFHTN',
    redirectUri: window.location.origin,
    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
  });

}])

.run(['clientId', function(clientId) {
  SC.initialize({
    client_id: clientId
  });
}])

.run(['$sce', function($sce) {
  $sce.trustAsResourceUrl('i2.sndcdn.com');
}]);