angular.module('app.controllers', [])

.controller 'MainCtrl',
  ['$rootScope', '$scope', '$window', '$http', '$auth', 'Account', '$state',
  ($rootScope, $scope, $window, $http, $auth, Account, $state) ->
    
    $scope.authenticating = false
    $scope.iosLogin = false

    $scope.showPlaceholder = ->
      $scope.authenticating or $scope.iosLogin

    $scope.clearMessages = ->
      $rootScope.messages = {}

    isIos = ->
      navigator.userAgent.match(/iPhone|iPad/)

    # mobile Safari doesn't support window.close()
    # this is a temporary workaround until that's fixed
    $scope.iosLogin = true if isIos() and window.opener

    $scope.login = ->
      if isIos()
        $window.addEventListener 'focus', ->
          unless $scope.authenticating
            $scope.iosLogin = false
            $window.removeEventListener 'focus', self.focus

      $scope.authenticating = true
      $auth.authenticate 'soundcloud'
        .then (response) ->
          $scope.getProfile()
        
        .then ->
          $scope.authenticating = false
          $state.go 'trending'

        .catch (error) ->
          $scope.authenticating = false
          $rootScope.messages.error = true

    $scope.logout = ->
      $auth.logout()
        .then -> $scope.user = null

    $scope.isAuthenticated = ->
      $auth.isAuthenticated()

    $scope.getProfile = ->
      Account.get()
        .then (response) -> $scope.user = response.data
        .catch (error) -> $rootScope.messages.error = true
]

.controller 'NavCtrl',
  ['$rootScope', '$scope', '$state', 'Soundcloud',
  ($rootScope, $scope, $state, Soundcloud) ->
    $scope.activeTab = (tab) ->
      tab == $state.current.name
]

.controller 'TrendingCtrl',
  ['$rootScope', '$scope', '$q', 'Soundcloud', 'musicCache', 'timeframe', '$state',
  ($rootScope, $scope, $q, Soundcloud, musicCache, timeframe, $state) ->
    
    $scope.showLoading = false

    parseDataForFeedback = (data) ->
      unless data.length
        $rootScope.messages.noDataFound = true
      else if data.length < 10
        $rootScope.messages.follow = true

    if musicCache.cached
      $q.when(Soundcloud.filterByTime(musicCache.get(), timeframe.time))
        .then (songs) ->
          $scope.showLoading = false
          $scope.songs = songs
          parseDataForFeedback(songs)

        .catch (error) ->
          $scope.showLoading = false
          $rootScope.messages.error = true
    else
      $scope.showLoading = true
      $scope.getProfile()
        .then (user) ->
          Soundcloud.parseUser(user.uid)

        .then (songs) ->
          $scope.showLoading = false
          musicCache.set songs
          $q.when(Soundcloud.filterByTime(songs, timeframe.time))

        .then (filteredSongs) ->
          $scope.songs = filteredSongs
          parseDataForFeedback(filteredSongs)

        .catch (error) ->
          $scope.showLoading = false
          $rootScope.messages.error = true

    $scope.$on '$destroy', ->
      $scope.songs = null

    # $scope.songs = [
    #   {
    #     id: 168479631
    #     permalink_url: "http://soundcloud.com/sbtrkt/sbtrkt-the-light-feat-denai-moore"
    #     title: "SBTRKT - THE LIGHT ft Denai Moore"
    #     user:
    #       permalink_url: "http://soundcloud.com/sbtrkt"
    #       username: "SBTRKT"
    #   }
    #   {
    #     id: 168992385
    #     permalink_url: "http://soundcloud.com/four-tet/john-beltran-faux-four-tet-remixtext033"
    #     title: "John Beltran - Faux (Four Tet Remix)TEXT033"
    #     user:
    #       permalink_url: "http://soundcloud.com/four-tet"
    #       username: "Four Tet"
    #   }
    #   {
    #     id: 168460044
    #     permalink_url: "http://soundcloud.com/xlr8r/kidkanevil-thousand-year-forest-one-for-yosi"
    #     title: "kidkanevil - Thousand Year Forest (One for Yosi)"
    #     user:
    #       permalink_url: "http://soundcloud.com/xlr8r"
    #       username: "XLR8R"
    #   }
    # ]
]