angular.module('app.directives', [])

.directive('musicPlayer', ['$http', 'soundcloudUrl', 'clientId', function($http, soundcloudUrl, clientId) {
  return {
    restrict: 'A',
    scope: {
      url: '@',
      title: '@',
      username: '@',
      artistUrl: '@'
    },
    templateUrl: 'music-player.html',
    link: function(scope, elem, attrs) {
      var audio = document.createElement('audio');
      var currentTime = 0;
      var src = soundcloudUrl + 'tracks/' + attrs.musicPlayer + '/stream' + '?client_id=' + clientId;
      
      scope.playing = false;
      scope.currentTime = 0;
      scope.duration = 0;
      scope.loadingSong = false;

      scope.play = function() {
        scope.loadingSong = true;
        audio.src = src;
        audio.play();
        audio.addEventListener('canplay', function() {
          scope.loadingSong = false;
          if (currentTime) audio.currentTime = currentTime;
          scope.playing = true;
        });
      };

      scope.pause = function() {
        audio.pause();
        scope.loadingSong = false;
        scope.playing = false;
      };

      var seekTo = function(time) {
        audio.currentTime = parseInt(time, 10);
      };

      scope.seek = function(e) {
        var offset = e.offsetX ? e.offsetX : e.layerX;
        var targetWidth = e.target.offsetWidth;
        if (!audio.readyState) return false;
        var xpos = offset / targetWidth;
        seekTo(xpos * audio.duration);
      };

      scope.$on('$destroy', function() {
        audio.pause();
        audio.remove();
      });

      audio.addEventListener('pause', function() {
        currentTime = audio.currentTime;
      }, false);

      audio.addEventListener('timeupdate', function() {
        scope.$apply(function() {
          scope.currentTime = audio.currentTime;
          scope.duration = audio.duration;
        });
      }, false);

      audio.addEventListener('ended', function() {
        currentTime = 0;
        scope.$apply(function() {
          scope.playing = false;
        });
      });
    }
  };
}]);
