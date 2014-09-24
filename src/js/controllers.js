angular.module('app.controllers', [])
.controller('MainCtrl', ['$scope', '$http', 'tokenHandler', '$auth', function($scope, $http, tokenHandler, $auth) {

  $scope.login = function() {
    $auth.authenticate('soundcloud')
      .then(function(response) {
        console.log("Response:", response);
      })
      .catch(function(response) {
        console.log("Error:", response);
      });
  };

}])

.controller('AuthCtrl', ['$scope', '$http', function($scope, $http) {

}])

.controller('NavCtrl', ['$scope', '$state', 'Soundcloud', function($scope, $state, Soundcloud) {
  $scope.messages = {};

  $state.go('trending.week');

  $scope.activeTab = function(tab) {
    return tab === $state.current.name;
  };

  $scope.clearMessages = function() {
    $scope.messages = {};
  };

  $scope.$on('data:notFound', function() {
    $scope.messages.noDataFound = true;
  });

  $scope.$on('data:follow', function() {
    $scope.messages.follow = true;
  });

  $scope.$on('data:error', function(evt, error) {
    console.log(error);
    $scope.messages.error = error.data.errors;
  });
}])

.controller('TrendingCtrl', ['$scope', 'Soundcloud', 'timeframe', '$state', function($scope, Soundcloud, timeframe, $state) {
  // Soundcloud.parseUser('yit_j', timeframe.time)
  //   .then(function(songs) {
  //     $scope.songs = songs;
  //     if (!songs.length) {
  //       $scope.$emit('data:notFound');
  //     } else if (songs.length < 10) {
  //       $scope.$emit('data:follow');
  //     }
  //   })
  //   .catch(function(err) {
  //     if (err) $scope.$emit('data:error', err);
  //   });

}]);
