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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sbGVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwLmNvbnRyb2xsZXJzJywgW10pXG4uY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRodHRwJywgJyRhdXRoJywgJ0FjY291bnQnLCAnJHN0YXRlJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGF1dGgsIEFjY291bnQsICRzdGF0ZSkge1xuXG4gICRzY29wZS5hdXRoZW50aWNhdGluZyA9IGZhbHNlO1xuXG4gICRzY29wZS5jbGVhck1lc3NhZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgJHJvb3RTY29wZS5tZXNzYWdlcyA9IHt9O1xuICB9O1xuXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5hdXRoZW50aWNhdGluZyA9IHRydWU7XG4gICAgcmV0dXJuICRhdXRoLmF1dGhlbnRpY2F0ZSgnc291bmRjbG91ZCcpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuZ2V0UHJvZmlsZSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzdGF0ZS5nbygndHJlbmRpbmcnKTtcbiAgICAgICAgICAkc2NvcGUuYXV0aGVudGljYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICRzY29wZS5hdXRoZW50aWNhdGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoZXJyb3IpICRyb290U2NvcGUubWVzc2FnZXMuZXJyb3IgPSBlcnJvci5kYXRhLmVycm9ycztcbiAgICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGF1dGgubG9nb3V0KClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUudXNlciA9IG51bGw7XG4gICAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRhdXRoLmlzQXV0aGVudGljYXRlZCgpO1xuICB9O1xuXG4gICRzY29wZS5nZXRQcm9maWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEFjY291bnQuZ2V0KClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS51c2VyID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgcmV0dXJuICRzY29wZS51c2VyO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IpICRyb290U2NvcGUubWVzc2FnZXMuZXJyb3IgPSBlcnJvci5kYXRhLmVycm9ycztcbiAgICAgIH0pO1xuICB9O1xuXG59XSlcblxuLmNvbnRyb2xsZXIoJ05hdkN0cmwnLCBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRzdGF0ZScsICdTb3VuZGNsb3VkJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFNvdW5kY2xvdWQpIHtcblxuICAkc3RhdGUuZ28oJ3RyZW5kaW5nLndlZWsnKTtcblxuICAkc2NvcGUuYWN0aXZlVGFiID0gZnVuY3Rpb24odGFiKSB7XG4gICAgcmV0dXJuIHRhYiA9PT0gJHN0YXRlLmN1cnJlbnQubmFtZTtcbiAgfTtcblxuICAkc2NvcGUuJG9uKCdkYXRhOm5vdEZvdW5kJywgZnVuY3Rpb24oKSB7XG4gICAgJHJvb3RTY29wZS5tZXNzYWdlcy5ub0RhdGFGb3VuZCA9IHRydWU7XG4gIH0pO1xuXG4gICRzY29wZS4kb24oJ2RhdGE6Zm9sbG93JywgZnVuY3Rpb24oKSB7XG4gICAgJHJvb3RTY29wZS5tZXNzYWdlcy5mb2xsb3cgPSB0cnVlO1xuICB9KTtcblxuICAkc2NvcGUuJG9uKCdkYXRhOmVycm9yJywgZnVuY3Rpb24oZXZ0LCBlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAkcm9vdFNjb3BlLm1lc3NhZ2VzLmVycm9yID0gZXJyb3IuZGF0YS5lcnJvcnM7XG4gIH0pO1xufV0pXG5cbi5jb250cm9sbGVyKCdUcmVuZGluZ0N0cmwnLFxuICBbJyRzY29wZScsICckcScsICdTb3VuZGNsb3VkJywgJ211c2ljQ2FjaGUnLCAndGltZWZyYW1lJywgJyRzdGF0ZScsXG4gIGZ1bmN0aW9uKCRzY29wZSwgJHEsIFNvdW5kY2xvdWQsIG11c2ljQ2FjaGUsIHRpbWVmcmFtZSwgJHN0YXRlKSB7XG5cbiAgJHNjb3BlLnNob3dMb2FkaW5nID0gZmFsc2U7XG5cbiAgaWYgKG11c2ljQ2FjaGUuY2FjaGVkKSB7XG4gICAgJHEud2hlbihTb3VuZGNsb3VkLmZpbHRlckJ5VGltZShtdXNpY0NhY2hlLmdldCgpLCB0aW1lZnJhbWUudGltZSkpXG4gICAgICAudGhlbihmdW5jdGlvbihzb25ncykge1xuICAgICAgICAkc2NvcGUuc2hvd0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnNvbmdzID0gc29uZ3M7XG4gICAgICAgIGlmICghc29uZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgJHNjb3BlLiRlbWl0KCdkYXRhOm5vdEZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc29uZ3MubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2RhdGE6Zm9sbG93Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgJHNjb3BlLnNob3dMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChlcnJvcikgJHNjb3BlLiRlbWl0KCdkYXRhOmVycm9yJywgZXJyb3IpO1xuICAgICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJHNjb3BlLnNob3dMb2FkaW5nID0gdHJ1ZTtcbiAgICAkc2NvcGUuZ2V0UHJvZmlsZSgpLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgXG4gICAgICBTb3VuZGNsb3VkLnBhcnNlVXNlcih1c2VyLnVpZClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oc29uZ3MpIHtcbiAgICAgICAgICAkc2NvcGUuc2hvd0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICBtdXNpY0NhY2hlLnNldChzb25ncyk7XG5cbiAgICAgICAgICAkcS53aGVuKFNvdW5kY2xvdWQuZmlsdGVyQnlUaW1lKHNvbmdzLCB0aW1lZnJhbWUudGltZSkpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaWx0ZXJlZFNvbmdzKSB7XG4gICAgICAgICAgICAgICRzY29wZS5zb25ncyA9IGZpbHRlcmVkU29uZ3M7XG4gICAgICAgICAgICAgIGlmICghZmlsdGVyZWRTb25ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2RhdGE6bm90Rm91bmQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWx0ZXJlZFNvbmdzLmxlbmd0aCA8IDEwKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdkYXRhOmZvbGxvdycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikgJHNjb3BlLiRlbWl0KCdkYXRhOmVycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSAkc2NvcGUuJGVtaXQoJ2RhdGE6ZXJyb3InLCBlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gIC8vICAgJHNjb3BlLnNvbmdzID0gbnVsbDtcbiAgLy8gfSk7XG5cbiAgXG4gIC8vICRzY29wZS5zb25ncyA9IFtcbiAgLy8gICB7XG4gIC8vICAgICBpZDogMTY4NDc5NjMxLFxuICAvLyAgICAgcGVybWFsaW5rX3VybDogXCJodHRwOi8vc291bmRjbG91ZC5jb20vc2J0cmt0L3NidHJrdC10aGUtbGlnaHQtZmVhdC1kZW5haS1tb29yZVwiLFxuICAvLyAgICAgdGl0bGU6IFwiU0JUUktUIC0gVEhFIExJR0hUIGZ0IERlbmFpIE1vb3JlXCIsXG4gIC8vICAgICB1c2VyOiB7XG4gIC8vICAgICAgIHBlcm1hbGlua191cmw6IFwiaHR0cDovL3NvdW5kY2xvdWQuY29tL3NidHJrdFwiLFxuICAvLyAgICAgICB1c2VybmFtZTogXCJTQlRSS1RcIlxuICAvLyAgICAgfVxuICAvLyAgIH0sXG4gIC8vICAge1xuICAvLyAgICAgaWQ6IDE2ODk5MjM4NSxcbiAgLy8gICAgIHBlcm1hbGlua191cmw6IFwiaHR0cDovL3NvdW5kY2xvdWQuY29tL2ZvdXItdGV0L2pvaG4tYmVsdHJhbi1mYXV4LWZvdXItdGV0LXJlbWl4dGV4dDAzM1wiLFxuICAvLyAgICAgdGl0bGU6IFwiSm9obiBCZWx0cmFuIC0gRmF1eCAoRm91ciBUZXQgUmVtaXgpVEVYVDAzM1wiLFxuICAvLyAgICAgdXNlcjoge1xuICAvLyAgICAgICBwZXJtYWxpbmtfdXJsOiBcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS9mb3VyLXRldFwiLFxuICAvLyAgICAgICB1c2VybmFtZTogXCJGb3VyIFRldFwiXG4gIC8vICAgICB9XG4gIC8vICAgfSxcbiAgLy8gICB7XG4gIC8vICAgICBpZDogMTY4NDYwMDQ0LFxuICAvLyAgICAgcGVybWFsaW5rX3VybDogXCJodHRwOi8vc291bmRjbG91ZC5jb20veGxyOHIva2lka2FuZXZpbC10aG91c2FuZC15ZWFyLWZvcmVzdC1vbmUtZm9yLXlvc2lcIixcbiAgLy8gICAgIHRpdGxlOiBcImtpZGthbmV2aWwgLSBUaG91c2FuZCBZZWFyIEZvcmVzdCAoT25lIGZvciBZb3NpKVwiLFxuICAvLyAgICAgdXNlcjoge1xuICAvLyAgICAgICBwZXJtYWxpbmtfdXJsOiBcImh0dHA6Ly9zb3VuZGNsb3VkLmNvbS94bHI4clwiLFxuICAvLyAgICAgICB1c2VybmFtZTogXCJYTFI4UlwiXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyBdO1xuXG59XSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=