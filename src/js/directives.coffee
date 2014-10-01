angular.module('app.directives', [])

.directive 'musicPlayer', ['$http', 'soundcloudUrl', 'clientId', ($http, soundcloudUrl, clientId) ->
  restrict: 'A'
  templateUrl: 'music-player.html'
  scope:
    url: '@'
    title: '@'
    username: '@'
    artistUrl: '@'
  link: (scope, elem, attrs) ->

    audio = document.createElement 'audio'
    currentTime = 0
    src = "#{soundcloudUrl}tracks/#{attrs.musicPlayer}/stream?client_id=#{clientId}"

    scope.playing = false
    scope.currentTime = 0
    scope.duration = 0
    scope.loadingSong = false

    scope.play = ->
      scope.loadingSong = true
      audio.src = src
      audio.play()
      audio.addEventListener 'canplay', ->
        scope.loadingSong = false
        audio.currentTime ||= currentTime
        scope.playing = true

    scope.pause = ->
      audio.pause()
      scope.loadingSong = false
      scope.playing = false

    scope.seek = (e) ->
      # return false unless audio.readyState
      if offset = e.offsetX || e.layerX - e.target.offsetLeft
        percent = offset / e.target.offsetWidth
        duration = audio.duration
        seekTo = duration * percent
        audio.currentTime = parseInt(seekTo, 10)

    audio.addEventListener 'pause', ->
      currentTime = audio.currentTime
    , false

    audio.addEventListener 'timeupdate', ->
      scope.$apply ->
        scope.currentTime = audio.currentTime
        scope.duration = audio.duration
    , false

    audio.addEventListener 'ended', ->
      currentTime = 0
      scope.$apply ->
        scope.playing = false
    , false
]
