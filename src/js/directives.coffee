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

    class AudioPlayer
      constructor: ->
        @audio       = document.createElement 'audio'
        @currentTime = 0
        @src         = "#{soundcloudUrl}tracks/#{attrs.musicPlayer}/stream?client_id=#{clientId}"
        @eventTypes  = ['pause', 'timeupdate', 'ended', 'canplay']
        @setEvents()

      setEvents: ->
        @audio.addEventListener 'pause', =>
          @currentTime = @audio.currentTime
        , false

        @audio.addEventListener 'timeupdate', =>
          scope.$apply =>
            scope.currentTime = @audio.currentTime
            scope.duration = @audio.duration
        , false

        @audio.addEventListener 'ended', =>
          @currentTime = 0
          scope.$apply ->
            scope.playing = false
        , false

      play: =>
        scope.loadingSong = true
        @audio.src = @src
        @audio.play()
        @audio.addEventListener 'canplay', =>
          @audio.removeEventListener 'canplay'
          @audio.currentTime ||= @currentTime
          scope.loadingSong = false
          scope.playing = true

      pause: =>
        @audio.pause()
        [scope.loadingSong, scope.playing] = [false, false]

      seek: (e) =>
        if offset = e.offsetX || e.layerX - e.target.offsetLeft
          percent = offset / e.target.offsetWidth
          duration = @audio.duration
          seekTo = duration * percent
          @audio.currentTime = parseInt(seekTo, 10)

      destroy: =>
        @pause()
        for event in @eventTypes
          @audio.removeEventListener event

    
    player = new AudioPlayer()

    [scope.duration, scope.currentTime] = [0, 0]
    [scope.playing, scope.loadingSong] = [false, false]

    scope.play = ->
      player.play()

    scope.pause = ->
      player.pause()

    scope.seek = (e) ->
      player.seek(e)

    scope.$on '$destroy', ->
      player.destroy()
]
