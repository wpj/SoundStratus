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

      scope.play = function() {
        audio.src = src;
        audio.addEventListener('canplay', function() {
          if (currentTime) audio.currentTime = currentTime;
          audio.play();
          scope.playing = true;
        });
      };

      scope.pause = function() {
        audio.pause();
        scope.playing = false;
      };

      scope.seek = function(e) {
        if (!audio.readyState) return false;
        var xpos = e.offsetX / e.target.offsetWidth;
        audio.currentTime = (xpos * audio.duration);
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
