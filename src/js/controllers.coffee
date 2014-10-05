angular.module('app.controllers', [])

.controller 'MainCtrl',
  ['$rootScope', '$scope', '$window', '$auth', 'Account', '$state',
  ($rootScope, $scope, $window, $auth, Account, $state) ->
    
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
          $state.go 'trending.week'

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
  ['$rootScope', '$scope', '$state', 'flash', ($rootScope, $scope, $state, flash) ->
    $scope.activeTab = (tab) ->
      tab == $state.current.name
    $rootScope.messages.hasFlash = not flash.enabled
]

.controller 'TrendingCtrl',
  ['$rootScope', '$scope', '$q', 'Soundcloud', 'musicCache', 'timeframe',
  ($rootScope, $scope, $q, Soundcloud, musicCache, timeframe) ->
    
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
    #     id: 170000664
    #     duration: 254141
    #     permalink_url: "http://soundcloud.com/jonhopkins/form-by-firelight-with-raphaelle-standell"
    #     stream_url: "https://api.soundcloud.com/tracks/170000664/stream"
    #     title: "Form By Firelight (with Raphaelle Standell)"
    #     user:
    #       permalink_url: "http://soundcloud.com/jonhopkins"
    #       username: "Jon Hopkins"
    #   }
    #   {
    #     id: 170236823
    #     duration: 203539
    #     permalink_url: "http://soundcloud.com/glassanimals/hazey-rework-feat-rome-fortune"
    #     stream_url: "https://api.soundcloud.com/tracks/170236823/stream"
    #     title: "Hazey (Dave Glass Animals Rework feat. Rome Fortune)"
    #     user:
    #       permalink_url: "http://soundcloud.com/glassanimals"
    #       username: "Glass Animals"
    #   }
    # ]
]