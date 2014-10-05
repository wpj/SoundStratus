angular.module('app.services', [])

.constant 'clientId', '0d037198126d5d12705d3e5669b9dd9e'
.constant 'soundcloudUrl', '//api.soundcloud.com/'

.factory 'Soundcloud',
  ['$http', '$q', 'clientId', 'soundcloudUrl',
  ($http, $q, clientId, soundcloudUrl) ->

    params = client_id: clientId

    parseUser = (user) ->
      getFollowings user
        .then (followedUsers) -> parseFollowings followedUsers
        .then (followingUserTracks) -> parseTracks _.flatten(followingUserTracks)

    # returns an array of user objects
    getFollowings = (user) ->
      $http.get("#{soundcloudUrl}users/#{user}/followings.json", params: params)
      .then (data) -> data.data

    parseFollowings = (followingUser) ->
      $q.all _.map(followingUser, (following) -> getTracks following.id)

    getTracks = (user) ->
      $q.all [
        $http.get("#{soundcloudUrl}users/#{user}/favorites.json", params: params)
        $http.get("#{soundcloudUrl}users/#{user}/tracks.json", params: params)
      ]

    parseTracks = (followingUserTracks) ->
      # returns a Lodash object (array) of song objects
      _(followingUserTracks)
        .map (tracks) -> tracks.data if tracks.data
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

.factory 'Account',
  ['$http', ($http) ->
    
    get: -> $http.get '/api/me'
]

.factory 'musicCache', ->
  musicCache = []

  return {
    get: -> musicCache
    set: (cache) ->
      musicCache = cache
      @cached = true
    cached: false
    clear: ->
      musicCache = []
      @cached = false
  }

.factory 'flash', ->
  enabled: false
  test: ->
    try
      @enabled = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'))
    catch e
      @enabled = 'undefined' isnt typeof navigator.mimeTypes['application/x-shockwave-flash']
