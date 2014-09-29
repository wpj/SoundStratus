angular.module('app.controllers', [])
.controller('MainCtrl', ['$rootScope', '$scope', '$http', '$auth', 'Account', '$state', function($rootScope, $scope, $http, $auth, Account, $state) {

  $scope.authenticating = false;

  $scope.clearMessages = function() {
    $rootScope.messages = {};
  };

  $scope.login = function() {
    $scope.authenticating = true;
    return $auth.authenticate('soundcloud')
      .then(function(response) {
        $scope.getProfile()
        .then(function() {
          $state.go('trending');
          $scope.authenticating = false;
        });
      })
      .catch(function(error) {
        $scope.authenticating = false;
        if (error) $rootScope.messages.error = error.data.errors;
      });
  };

  $scope.logout = function() {
    return $auth.logout()
      .then(function() {
        $scope.user = null;
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

.controller('TrendingCtrl',
  ['$scope', '$q', 'Soundcloud', 'musicCache', 'timeframe', '$state',
  function($scope, $q, Soundcloud, musicCache, timeframe, $state) {

  $scope.showLoading = false;

  if (musicCache.cached) {
    $q.when(Soundcloud.filterByTime(musicCache.get(), timeframe.time))
      .then(function(songs) {
        $scope.showLoading = false;
        $scope.songs = songs;
        if (!songs.length) {
          $scope.$emit('data:notFound');
        } else if (songs.length < 10) {
          $scope.$emit('data:follow');
        }
      })
      .catch(function(error) {
        $scope.showLoading = false;
        if (error) $scope.$emit('data:error', error);
      });
  } else {
    $scope.showLoading = true;
    $scope.getProfile().then(function(user) {
      
      Soundcloud.parseUser(user.uid)
        .then(function(songs) {
          $scope.showLoading = false;
          musicCache.set(songs);

          $q.when(Soundcloud.filterByTime(songs, timeframe.time))
            .then(function(filteredSongs) {
              $scope.songs = filteredSongs;
              if (!filteredSongs.length) {
                $scope.$emit('data:notFound');
              } else if (filteredSongs.length < 10) {
                $scope.$emit('data:follow');
              }
            })
            .catch(function(error) {
              if (error) $scope.$emit('data:error', error);
            });
        })
        .catch(function(err) {
          if (err) $scope.$emit('data:error', err);
        });
    });
  }

  // $scope.$on('$destroy', function() {
  //   $scope.songs = null;
  // });

  
  // $scope.songs = [
  //   {
  //     id: 168479631,
  //     permalink_url: "http://soundcloud.com/sbtrkt/sbtrkt-the-light-feat-denai-moore",
  //     title: "SBTRKT - THE LIGHT ft Denai Moore",
  //     user: {
  //       permalink_url: "http://soundcloud.com/sbtrkt",
  //       username: "SBTRKT"
  //     }
  //   },
  //   {
  //     id: 168992385,
  //     permalink_url: "http://soundcloud.com/four-tet/john-beltran-faux-four-tet-remixtext033",
  //     title: "John Beltran - Faux (Four Tet Remix)TEXT033",
  //     user: {
  //       permalink_url: "http://soundcloud.com/four-tet",
  //       username: "Four Tet"
  //     }
  //   },
  //   {
  //     id: 168460044,
  //     permalink_url: "http://soundcloud.com/xlr8r/kidkanevil-thousand-year-forest-one-for-yosi",
  //     title: "kidkanevil - Thousand Year Forest (One for Yosi)",
  //     user: {
  //       permalink_url: "http://soundcloud.com/xlr8r",
  //       username: "XLR8R"
  //     }
  //   }
  // ];

}]);
