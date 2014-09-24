angular.module('app.directives', [])
.directive('soundcloudWidget', ['$sce', function($sce) {
  return {
    restrict: 'EA',
    scope: {
      songId: '@'
    },
    templateUrl: 'soundcloud-widget.html',
    link: function(scope, elem, attrs) {
      scope.scUrl = function() {
        return $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + scope.songId + '&auto_play=false&hide_related=false&show_user=true&show_comments=false&show_reposts=false&visual=true&single_active=true&buying=false');
      };
    }
  };
}]);
