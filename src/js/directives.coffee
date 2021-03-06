angular.module('app.directives', [])

.directive 'musicPlayer', ['$http', '$interval', 'soundcloudUrl', 'clientId', 'flash', ($http, $interval, soundcloudUrl, clientId, flash) ->
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
        @audio =
          duration: attrs.duration
          error: false
        scope.loadingSong = true
        SC.stream "/tracks/#{attrs.musicPlayer}", (player) =>
          # @audio.error = true unless player?
          scope.loadingsong = false
          @audio.controls = player
          
          unless flash.enabled
            if @audio.controls.getType().match /Flash/
              elem.replaceWith "<iframe width='100%' height='170' scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/#{attrs.musicPlayer}&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;visual=true&amp;single_active=false&amp;sharing=false&amp;buying=false'></iframe>"

      play: ->
        scope.playing = true
        @audio.controls.play()
        @interval = $interval =>
          scope.currentTime = @audio.controls.getCurrentPosition()
          if @audio.controls.getState() is 'ended'
            scope.playing = false
            $interval.cancel @interval
          else if @audio.controls.getState() is 'error'
            scope.playing = false
            @audio.error = true
            $interval.cancel @interval
        , 100

      pause: ->
        $interval.cancel @interval
        # use ? to handle if player is being destroyed before
        # @audio.controls is defined
        @audio.controls?.pause()
        scope.playing = false

      seek: (e) ->
        if offset = e.offsetX || e.layerX - e.target.offsetLeft
          percent = offset / e.target.offsetWidth
          seekTo = @audio.duration * percent
          @audio.controls.seek seekTo

      destroy: ->
        @pause()
        $interval.cancel @interval

    player = new AudioPlayer()
    scope.musicPlayer = player
    scope.duration = player.audio.duration
    scope.clearError = -> player.audio.error = false

    scope.$on '$destroy', ->
      player.destroy()
]

# .directive 'musicPlayer', ['$http', 'soundcloudUrl', 'clientId', ($http, soundcloudUrl, clientId) ->
#   restrict: 'A'
#   templateUrl: 'music-player.html'
#   scope:
#     url: '@'
#     title: '@'
#     username: '@'
#     artistUrl: '@'
#   link: (scope, elem, attrs) ->

#     class AudioPlayer
#       constructor: ->
#         @audio       = document.createElement 'audio'
#         @currentTime = 0
#         @src         = "#{attrs.streamUrl}?client_id=#{clientId}"
#         @eventTypes  = ['pause', 'timeupdate', 'ended', 'canplay']
#         @setEvents()

#       setEvents: ->
#         @audio.addEventListener 'pause', =>
#           @currentTime = @audio.currentTime
#         , false

#         @audio.addEventListener 'timeupdate', =>
#           scope.$apply =>
#             scope.currentTime = @audio.currentTime
#             scope.duration = @audio.duration
#         , false

#         @audio.addEventListener 'ended', =>
#           @currentTime = 0
#           scope.$apply ->
#             scope.playing = false
#         , false

#       play: =>
#         scope.loadingSong = true
#         @audio.src = @src
#         @audio.play()
#         @audio.addEventListener 'canplay', =>
#           @audio.removeEventListener 'canplay', self.canplay
#           @audio.currentTime ||= @currentTime
#           scope.loadingSong = false
#           scope.playing = true

#       pause: =>
#         @audio.pause()
#         [scope.loadingSong, scope.playing] = [false, false]

#       seek: (e) =>
#         if offset = e.offsetX || e.layerX - e.target.offsetLeft
#           percent = offset / e.target.offsetWidth
#           duration = @audio.duration
#           seekTo = duration * percent
#           @audio.currentTime = parseInt(seekTo, 10)

#       destroy: =>
#         @pause()
#         for event in @eventTypes
#           @audio.removeEventListener event, self[event]

    
#     player = new AudioPlayer()

#     [scope.duration, scope.currentTime] = [0, 0]
#     [scope.playing, scope.loadingSong] = [false, false]

#     scope.play = ->
#       player.play()

#     scope.pause = ->
#       player.pause()

#     scope.seek = (e) ->
#       player.seek(e)

#     scope.$on '$destroy', ->
#       player.destroy()
# ]
