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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdjaXJydXNTb3VuZHMnLCBbJ2FwcC5jb250cm9sbGVycycsICdhcHAuZGlyZWN0aXZlcycsICdhcHAuZmlsdGVycycsICdhcHAuc2VydmljZXMnLCAndWkucm91dGVyJywgJ3NhdGVsbGl6ZXInLCAnbmdBbmltYXRlJ10pXG5cbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdob21lJywge1xuICAgICAgdXJsOiAnLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndHJlbmRpbmcnLCB7XG4gICAgICB1cmw6ICcvcG9wdWxhcicsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3RyZW5kaW5nLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ05hdkN0cmwnLFxuICAgICAgb25FbnRlcjogWyckc3RhdGUnLCAnJGF1dGgnLCBmdW5jdGlvbigkc3RhdGUsICRhdXRoKSB7XG4gICAgICAgIGlmICghJGF1dGguaXNBdXRoZW50aWNhdGVkKCkpIHsgJHN0YXRlLmdvKCdob21lJyk7IH1cbiAgICAgIH1dXG4gICAgfSlcbiAgICAuc3RhdGUoJ3RyZW5kaW5nLnRvZGF5Jywge1xuICAgICAgdXJsOiAnL3RvZGF5JyxcbiAgICAgIHRlbXBsYXRlVXJsOiAndHJlbmRpbmctbGlzdC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdUcmVuZGluZ0N0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICAndGltZWZyYW1lJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHt0aW1lOiAnZGF5J307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgndHJlbmRpbmcud2VlaycsIHtcbiAgICAgIHVybDogJy90aGlzLXdlZWsnLFxuICAgICAgdGVtcGxhdGVVcmw6ICd0cmVuZGluZy1saXN0Lmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1RyZW5kaW5nQ3RybCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgICd0aW1lZnJhbWUnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4ge3RpbWU6ICd3ZWVrJ307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgndHJlbmRpbmcubW9udGgnLCB7XG4gICAgICB1cmw6ICcvdGhpcy1tb250aCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3RyZW5kaW5nLWxpc3QuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVHJlbmRpbmdDdHJsJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgJ3RpbWVmcmFtZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB7dGltZTogJ21vbnRoJ307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgndHJlbmRpbmcuYWxsVGltZScsIHtcbiAgICAgIHVybDogJy9hbGwtdGltZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3RyZW5kaW5nLWxpc3QuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVHJlbmRpbmdDdHJsJyxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgJ3RpbWVmcmFtZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB7dGltZTogJ2FsbFRpbWUnfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn1dKVxuXG4uY29uZmlnKFsnJGF1dGhQcm92aWRlcicsICdjbGllbnRJZCcsIGZ1bmN0aW9uKCRhdXRoUHJvdmlkZXIsIGNsaWVudElkKSB7XG5cbiAgJGF1dGhQcm92aWRlci5vYXV0aDIoe1xuICAgIG5hbWU6ICdzb3VuZGNsb3VkJyxcbiAgICB1cmw6ICcvYXV0aC9zb3VuZGNsb3VkJyxcbiAgICBjbGllbnRJZDogY2xpZW50SWQsXG4gICAgcmVkaXJlY3RVcmk6IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9jb25uZWN0JyxcbiAgICBvcHRpb25hbFVybFBhcmFtczogWydkaXNwbGF5J10sXG4gICAgZGlzcGxheTogJ3BvcHVwJ1xuICB9KTtcblxufV0pXG5cbi5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAkcm9vdFNjb3BlLm1lc3NhZ2VzID0ge307XG5cbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICAkcm9vdFNjb3BlLm1lc3NhZ2VzID0ge307XG4gIH0pO1xufV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9