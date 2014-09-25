angular.module('app.services', [])

.constant('clientId', '863060121a2ffb5d258e7a793da0546b')
.constant('soundcloudUrl', '//api.soundcloud.com/')

.factory('Soundcloud', ['$http', '$q', 'clientId', 'soundcloudUrl', function($http, $q, clientId, soundcloudUrl) {

  var params = {
    client_id: clientId
  };

  var parseUser = function(user, timeFrame) {
    return getFollowings(user)
      .then(function(followedUsers) { return parseFollowings(followedUsers); })
      .then(function(followingUserTracks) { return parseTracks(_.flatten(followingUserTracks)); })
      .then(function(parsedTracks) { return filterByTime(parsedTracks, timeFrame); });
  };

  // returns an array of user objects
  var getFollowings = function(user) {
    return $http.get(soundcloudUrl + 'users/' + user + '/followings.json', {
      params: params
    }).then(function(data) { return data.data; });
  };

  var parseFollowings = function(followingUser) {
    return $q.all(_.map(followingUser, function(following) {
      return getTracks(following.id);
    }));
  };

  var getTracks = function(user) {
    return $q.all([
      $http.get(soundcloudUrl + 'users/' + user + '/favorites.json', { params: params }),
      $http.get(soundcloudUrl + 'users/' + user + '/tracks.json', { params: params })
    ]);
  };

  var parseTracks = function(followingUserTracks) {

    // returns a Lodash object (array) of song objects
    return _(followingUserTracks)
      .map(function(tracks) { if (tracks.data) return tracks.data; })
      .flatten()
      .reject(function(track) { return !track.playback_count; })
      .uniq('id');
  };


  var filterByTime = function(tracks, time) {
    var date = new Date();

    if (time === 'day') {
      time = date.setDate(date.getDate() - 1);
    } else if (time === 'week') {
      time = date.setDate(date.getDate() - 7);
    } else if (time === 'month') {
      time = date.setMonth(date.getMonth() - 1);
    } else {
      time = null;
    }

    return tracks
      .reject(function(track) {
        if (time) return Date.parse(track.created_at) < time;
        else return;
      })
      .sortBy('playback_count')
      .reverse()
      .first(10)
      .value();
  };

  return {
    parseUser: parseUser
  };
}])

.factory('Account', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('/api/me');
    }
  };
}]);