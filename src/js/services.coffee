angular.module('app.services', [])

.constant 'clientId', '0d037198126d5d12705d3e5669b9dd9e'
.constant 'soundcloudUrl', '//api.soundcloud.com/'

.factory 'Soundcloud',
  ['$http', '$q', 'clientId', 'soundcloudUrl',
  ($http, $q, clientId, soundcloudUrl) ->

    params = client_id: clientId

    parseUser = (user) ->
      getFollowingsCount user
        .then (followingsCount) -> getFollowings user, followingsCount
        .then (followedUsers) -> parseFollowings _.flatten followedUsers
        .then (followingUserTracks) -> parseTracks followingUserTracks

    # parseUser constituent functions
    getFollowingsCount = (user) ->
      counter = 0
      deferred = $q.defer()

      getFollowingsCountFn = ->
        $http.get "#{soundcloudUrl}users/#{user}.json", params: params
          .then (response) -> deferred.resolve response.data.followings_count
          .catch (error) ->
            counter += 1
            if counter < 3 then getFollowingsCountFn()
            else deferred.reject error

      getFollowingsCountFn()
      deferred.promise

    # returns an array of arrays of user objects (needs to be flattened to use)
    getFollowings = (user, followingsCount) ->
      counter = 0
      deferred = $q.defer()

      getFollowingsFn = ->
        $q.all do ->
          for x in [0..followingsCount] by 200
            $http.get "#{soundcloudUrl}users/#{user}/followings.json",
              params:
                client_id: clientId
                limit: 200
                offset: x
            .then (data) ->
              data.data
        .then (data) -> deferred.resolve data
        .catch (error) ->
          counter += 1
          if counter < 3 then getFollowingsFn()
          else deferred.reject error

      getFollowingsFn()
      deferred.promise

    getTracksInfo = (user) ->
      counter = 0
      deferred = $q.defer()

      getTracksInfoFn = ->
        $http.get "#{soundcloudUrl}users/#{user}.json", params: params
          .then (response) ->
            deferred.resolve
              trackCount: response.data.track_count
              favoriteCount: response.data.public_favorites_count
          .catch (error) ->
            counter += 1
            if counter < 3 then getTracksInfoFn()
            else deferred.reject error

      getTracksInfoFn()
      deferred.promise

    getTracks = (user, trackCount, favoriteCount) ->
      counter = 0
      deferred = $q.defer()

      getTracksFn = ->
        $q.all [
          $q.all do ->
            for x in [0..favoriteCount] by 200
              $http.get "#{soundcloudUrl}users/#{user}/favorites.json",
                params:
                  client_id: clientId
                  limit: 200
                  offset: x
              .then (data) -> data.data

          $q.all do ->
            for x in [0..trackCount] by 200
              $http.get "#{soundcloudUrl}users/#{user}/tracks.json", 
                params:
                  client_id: clientId
                  limit: 200
                  offset: x
              .then (data) -> data.data
        ]
        .then (data) -> deferred.resolve data
        .catch (error) ->
          counter += 1
          if counter < 3 then getTracksFn()
          else deferred.reject error
      
      getTracksFn()
      deferred.promise

    parseFollowings = (followingUser) ->
      $q.all _.map followingUser, (following) ->
        getTracksInfo following.id
        .then (data) -> getTracks following.id, data.trackCount, data.favoriteCount

    parseTracks = (followingUserTracks) ->
      # returns a Lodash object (array) of song objects
      _(followingUserTracks)
        .flatten()
        .reject (track) -> !track.playback_count
        .uniq 'id'
    
    # end parseUser constituent functions

    
    filterByTime = (tracks, time) ->
      date = new Date()

      if time == 'day'        then time = date.setDate(date.getDate() - 1)
      else if time == 'week'  then time = date.setDate(date.getDate() - 7)
      else if time == 'month' then time = date.setMonth(date.getMonth() - 1)
      else                         time = null

      tracks
        .reject (track) ->
          if time
            Date.parse(track.created_at) < time
          else
            false
        .sortBy 'playback_count'
        .reverse()
        .first 10
        .value()

    checkUser = (username) ->
      $http.get "#{soundcloudUrl}users/#{username}", params: params

    return {
      parseUser: parseUser
      filterByTime: filterByTime
      checkUser: checkUser
    }
]

.factory 'Account', ['$http', ($http) -> get: -> $http.get '/api/me']

.factory 'musicCache', ->
  musicCache = []

  get: -> musicCache
  set: (cache) ->
    musicCache = cache
    @cached = true
  cached: false
  clear: ->
    musicCache = []
    @cached = false

.factory 'flash', ->
  enabled: false
  test: ->
    try
      @enabled = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'))
    catch e
      @enabled = 'undefined' isnt typeof navigator.mimeTypes['application/x-shockwave-flash']
