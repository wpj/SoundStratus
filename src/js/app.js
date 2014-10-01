angular.module('cirrusSounds', ['app.controllers', 'app.directives', 'app.filters', 'app.services', 'ui.router', 'satellizer', 'ngAnimate'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('trending', {
      url: '/popular',
      templateUrl: 'trending.html',
      controller: 'NavCtrl',
      onEnter: ['$state', '$auth', function($state, $auth) {
        if (!$auth.isAuthenticated()) { $state.go('home'); }
      }]
    })
    .state('trending.today', {
      url: '/today',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'day'};
        }
      }
    })
    .state('trending.week', {
      url: '/this-week',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'week'};
        }
      }
    })
    .state('trending.month', {
      url: '/this-month',
      templateUrl: 'trending-list.html',
      controller: 'TrendingCtrl',
      resolve: {
        'timeframe': function() {
          return {time: 'month'};
        }
      }
    })
    .state('trending.allTime', {
      url: '/all-time',
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
    authorizationEndpoint: 'https://soundcloud.com/connect',
    optionalUrlParams: ['display'],
    display: 'popup'
  });

}])

.run(['$rootScope', function($rootScope) {
  $rootScope.messages = {};

  $rootScope.$on('$stateChangeSuccess', function(evt) {
    $rootScope.messages = {};
  });
}]);
