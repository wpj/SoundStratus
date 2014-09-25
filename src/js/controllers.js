angular.module('app.controllers', [])
.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$auth', 'Account', '$state', function($rootScope, $scope, $http, $auth, Account, $state) {

  $scope.login = function() {
    return $auth.authenticate('soundcloud')
      .then(function(response) {
        $scope.getProfile()
        .then(function() { $state.go('trending'); });
      })
      .catch(function(error) {
        if (error) $rootScope.messages.error = error.data.errors;
      });
  };

  $scope.logout = function() {
    return $auth.logout()
      .then(function() {
        $scope.user = null;
        $state.go('login');
      });
  };

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.getProfile = function() {
    return Account.get()
      .then(function(response) {
        $scope.user = response.data;
        return $scope.user;
      })
      .catch(function(error) {
        if (error) $rootScope.messages.error = error.data.errors;
      });
  };

}])

.controller('AuthCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('NavCtrl', ['$rootScope', '$scope', '$state', 'Soundcloud', function($rootScope, $scope, $state, Soundcloud) {

  $state.go('trending.week');

  $scope.activeTab = function(tab) {
    return tab === $state.current.name;
  };

  $scope.$on('data:notFound', function() {
    $rootScope.messages.noDataFound = true;
  });

  $scope.$on('data:follow', function() {
    $rootScope.messages.follow = true;
  });

  $scope.$on('data:error', function(evt, error) {
    console.log(error);
    $rootScope.messages.error = error.data.errors;
  });
}])

.controller('TrendingCtrl', ['$scope', 'Soundcloud', 'timeframe', '$state', function($scope, Soundcloud, timeframe, $state) {

  $scope.getProfile().then(function(user) {
    console.log(user);
    Soundcloud.parseUser(user.uid, timeframe.time)
    .then(function(songs) {
      $scope.songs = songs;
      if (!songs.length) {
        $scope.$emit('data:notFound');
      } else if (songs.length < 10) {
        $scope.$emit('data:follow');
      }
    })
    .catch(function(err) {
      if (err) $scope.$emit('data:error', err);
    });
  });

}]);
