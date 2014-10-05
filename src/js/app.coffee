angular.module('cirrusSounds',
  ['app.controllers', 'app.directives', 'app.filters', 'app.services', 'ui.router', 'satellizer', 'ngAnimate'])

.config ['$stateProvider', '$urlRouterProvider',
  ($stateProvider, $urlRouterProvider) ->

    $stateProvider
      .state 'home',
        url: '/'
        templateUrl: 'home.html'

      .state 'trending',
        url: '/popular'
        templateUrl: 'trending.html'
        abstract: true
        controller: 'NavCtrl'
        onEnter: ['$state', '$auth', ($state, $auth) ->
          $state.go('home') unless $auth.isAuthenticated()
        ]

      .state 'trending.today',
        url: '/today'
        templateUrl: 'trending-list.html'
        controller: 'TrendingCtrl'
        resolve: timeframe: -> time: 'day'

      .state 'trending.week',
        url: '/this-week'
        templateUrl: 'trending-list.html'
        controller: 'TrendingCtrl'
        resolve: timeframe: -> time: 'week'

      .state 'trending.month',
        url: '/this-month'
        templateUrl: 'trending-list.html'
        controller: 'TrendingCtrl'
        resolve: timeframe: -> time: 'month'

      .state 'trending.allTime',
        url: '/all-time'
        templateUrl: 'trending-list.html'
        controller: 'TrendingCtrl'
        resolve: timeframe: -> time: 'allTime'

    # make .week the default child state of popular
    $urlRouterProvider.when '/popular', '/popular/this-week'
    $urlRouterProvider.when '/popular/', '/popular/this-week'
    $urlRouterProvider.otherwise '/'
]

.config ['$authProvider', 'clientId', ($authProvider, clientId) ->
  $authProvider.oauth2
    name: 'soundcloud'
    url: '/auth/soundcloud'
    clientId: clientId
    redirectUri: window.location.origin
    authorizationEndpoint: 'https://soundcloud.com/connect'
    optionalUrlParams: ['display']
    display: 'popup'
]

.run ['$rootScope', ($rootScope) ->
  $rootScope.messages = {}
  $rootScope.$on '$stateChangeSuccess', (evt) -> $rootScope.messages = {}
]

.run ['clientId', (clientId) ->
  SC.initialize client_id: clientId
]

.run ['flash', (flash) ->
  flash.test()
]
