angular.module('app.services', [])

.constant('clientId', '0d037198126d5d12705d3e5669b9dd9e')
.constant('soundcloudUrl', '//api.soundcloud.com/')

.factory('Soundcloud', ['$http', '$q', 'clientId', 'soundcloudUrl', function($http, $q, clientId, soundcloudUrl) {

  var params = {
    client_id: clientId
  };

  var parseUser = function(user) {
    return getFollowings(user)
      .then(function(followedUsers) { return parseFollowings(followedUsers); })
      .then(function(followingUserTracks) { return parseTracks(_.flatten(followingUserTracks)); });
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
    parseUser: parseUser,
    filterByTime: filterByTime
  };
}])

.factory('Account', ['$http', function($http) {
  return {
    get: function() {
      return $http.get('/api/me');
    }
  };
}])

.factory('musicCache', function() {
  var musicCache = [];
  return {
    get: function() { return musicCache; },
    set: function(cache) {
      musicCache = cache;
      this.cached = true;
    },
    cached: false
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZXMuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZXJ2aWNlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYXBwLnNlcnZpY2VzJywgW10pXG5cbi5jb25zdGFudCgnY2xpZW50SWQnLCAnMGQwMzcxOTgxMjZkNWQxMjcwNWQzZTU2NjliOWRkOWUnKVxuLmNvbnN0YW50KCdzb3VuZGNsb3VkVXJsJywgJy8vYXBpLnNvdW5kY2xvdWQuY29tLycpXG5cbi5mYWN0b3J5KCdTb3VuZGNsb3VkJywgWyckaHR0cCcsICckcScsICdjbGllbnRJZCcsICdzb3VuZGNsb3VkVXJsJywgZnVuY3Rpb24oJGh0dHAsICRxLCBjbGllbnRJZCwgc291bmRjbG91ZFVybCkge1xuXG4gIHZhciBwYXJhbXMgPSB7XG4gICAgY2xpZW50X2lkOiBjbGllbnRJZFxuICB9O1xuXG4gIHZhciBwYXJzZVVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgcmV0dXJuIGdldEZvbGxvd2luZ3ModXNlcilcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZvbGxvd2VkVXNlcnMpIHsgcmV0dXJuIHBhcnNlRm9sbG93aW5ncyhmb2xsb3dlZFVzZXJzKTsgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZvbGxvd2luZ1VzZXJUcmFja3MpIHsgcmV0dXJuIHBhcnNlVHJhY2tzKF8uZmxhdHRlbihmb2xsb3dpbmdVc2VyVHJhY2tzKSk7IH0pO1xuICB9O1xuXG4gIC8vIHJldHVybnMgYW4gYXJyYXkgb2YgdXNlciBvYmplY3RzXG4gIHZhciBnZXRGb2xsb3dpbmdzID0gZnVuY3Rpb24odXNlcikge1xuICAgIHJldHVybiAkaHR0cC5nZXQoc291bmRjbG91ZFVybCArICd1c2Vycy8nICsgdXNlciArICcvZm9sbG93aW5ncy5qc29uJywge1xuICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGRhdGEpIHsgcmV0dXJuIGRhdGEuZGF0YTsgfSk7XG4gIH07XG5cbiAgdmFyIHBhcnNlRm9sbG93aW5ncyA9IGZ1bmN0aW9uKGZvbGxvd2luZ1VzZXIpIHtcbiAgICByZXR1cm4gJHEuYWxsKF8ubWFwKGZvbGxvd2luZ1VzZXIsIGZ1bmN0aW9uKGZvbGxvd2luZykge1xuICAgICAgcmV0dXJuIGdldFRyYWNrcyhmb2xsb3dpbmcuaWQpO1xuICAgIH0pKTtcbiAgfTtcblxuICB2YXIgZ2V0VHJhY2tzID0gZnVuY3Rpb24odXNlcikge1xuICAgIHJldHVybiAkcS5hbGwoW1xuICAgICAgJGh0dHAuZ2V0KHNvdW5kY2xvdWRVcmwgKyAndXNlcnMvJyArIHVzZXIgKyAnL2Zhdm9yaXRlcy5qc29uJywgeyBwYXJhbXM6IHBhcmFtcyB9KSxcbiAgICAgICRodHRwLmdldChzb3VuZGNsb3VkVXJsICsgJ3VzZXJzLycgKyB1c2VyICsgJy90cmFja3MuanNvbicsIHsgcGFyYW1zOiBwYXJhbXMgfSlcbiAgICBdKTtcbiAgfTtcblxuICB2YXIgcGFyc2VUcmFja3MgPSBmdW5jdGlvbihmb2xsb3dpbmdVc2VyVHJhY2tzKSB7XG5cbiAgICAvLyByZXR1cm5zIGEgTG9kYXNoIG9iamVjdCAoYXJyYXkpIG9mIHNvbmcgb2JqZWN0c1xuICAgIHJldHVybiBfKGZvbGxvd2luZ1VzZXJUcmFja3MpXG4gICAgICAubWFwKGZ1bmN0aW9uKHRyYWNrcykgeyBpZiAodHJhY2tzLmRhdGEpIHJldHVybiB0cmFja3MuZGF0YTsgfSlcbiAgICAgIC5mbGF0dGVuKClcbiAgICAgIC5yZWplY3QoZnVuY3Rpb24odHJhY2spIHsgcmV0dXJuICF0cmFjay5wbGF5YmFja19jb3VudDsgfSlcbiAgICAgIC51bmlxKCdpZCcpO1xuICB9O1xuXG5cbiAgdmFyIGZpbHRlckJ5VGltZSA9IGZ1bmN0aW9uKHRyYWNrcywgdGltZSkge1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgIGlmICh0aW1lID09PSAnZGF5Jykge1xuICAgICAgdGltZSA9IGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDEpO1xuICAgIH0gZWxzZSBpZiAodGltZSA9PT0gJ3dlZWsnKSB7XG4gICAgICB0aW1lID0gZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gNyk7XG4gICAgfSBlbHNlIGlmICh0aW1lID09PSAnbW9udGgnKSB7XG4gICAgICB0aW1lID0gZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYWNrc1xuICAgICAgLnJlamVjdChmdW5jdGlvbih0cmFjaykge1xuICAgICAgICBpZiAodGltZSkgcmV0dXJuIERhdGUucGFyc2UodHJhY2suY3JlYXRlZF9hdCkgPCB0aW1lO1xuICAgICAgICBlbHNlIHJldHVybjtcbiAgICAgIH0pXG4gICAgICAuc29ydEJ5KCdwbGF5YmFja19jb3VudCcpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAuZmlyc3QoMTApXG4gICAgICAudmFsdWUoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBhcnNlVXNlcjogcGFyc2VVc2VyLFxuICAgIGZpbHRlckJ5VGltZTogZmlsdGVyQnlUaW1lXG4gIH07XG59XSlcblxuLmZhY3RvcnkoJ0FjY291bnQnLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9tZScpO1xuICAgIH1cbiAgfTtcbn1dKVxuXG4uZmFjdG9yeSgnbXVzaWNDYWNoZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgbXVzaWNDYWNoZSA9IFtdO1xuICByZXR1cm4ge1xuICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtdXNpY0NhY2hlOyB9LFxuICAgIHNldDogZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgIG11c2ljQ2FjaGUgPSBjYWNoZTtcbiAgICAgIHRoaXMuY2FjaGVkID0gdHJ1ZTtcbiAgICB9LFxuICAgIGNhY2hlZDogZmFsc2VcbiAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==