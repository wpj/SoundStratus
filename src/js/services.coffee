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

    getFollowingsCount = (user) ->
      $http.get "#{soundcloudUrl}users/#{user}.json", params: params
        .then (response) ->
          response.data.followings_count

    # returns an array of arrays of user objects (needs to be flattened to use)
    getFollowings = (user, followingsCount) ->
      $q.all do ->
        for x in [0..followingsCount] by 200
          $http.get "#{soundcloudUrl}users/#{user}/followings.json",
            params:
              client_id: clientId
              limit: 200
              offset: x
          .then (data) ->
            data.data

    getTracksInfo = (user) ->
      $http.get "#{soundcloudUrl}users/#{user}.json", params: params
        .then (response) ->
          trackCount: response.data.track_count
          favoriteCount: response.data.public_favorites_count

    parseFollowings = (followingUser) ->
      $q.all _.map followingUser, (following) ->
        getTracksInfo following.id
        .then (data) -> getTracks following.id, data.trackCount, data.favoriteCount

    getTracks = (user, trackCount, favoriteCount) ->
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

    parseTracks = (followingUserTracks) ->
      # returns a Lodash object (array) of song objects
      _(followingUserTracks)
        .flatten()
        .reject (track) -> !track.playback_count
        .uniq 'id'

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
