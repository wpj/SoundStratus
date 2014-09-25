angular.module("cirrusSounds",["app.controllers","app.directives","app.filters","app.services","ui.router","satellizer","plangular","ngAnimate"]).config(["$stateProvider","$urlRouterProvider",function(t,n){t.state("home",{url:"/",template:"<h1>Welcome to Cirrus Sounds</h1>"}).state("login",{url:"/login",templateUrl:"login.html",controller:"AuthCtrl",onEnter:["$state","$auth",function(t,n){n.isAuthenticated()&&t.go("trending")}]}).state("trending",{url:"/popular",templateUrl:"trending.html",controller:"NavCtrl",onEnter:["$state","$auth",function(t,n){n.isAuthenticated()||t.go("login")}]}).state("trending.today",{url:"/today",templateUrl:"trending-list.html",controller:"TrendingCtrl",resolve:{timeframe:function(){return{time:"day"}}}}).state("trending.week",{url:"/this-week",templateUrl:"trending-list.html",controller:"TrendingCtrl",resolve:{timeframe:function(){return{time:"week"}}}}).state("trending.month",{url:"/this-month",templateUrl:"trending-list.html",controller:"TrendingCtrl",resolve:{timeframe:function(){return{time:"month"}}}}).state("trending.allTime",{url:"/all-time",templateUrl:"trending-list.html",controller:"TrendingCtrl",resolve:{timeframe:function(){return{time:"allTime"}}}}),n.otherwise("/popular/this-week")}]).config(["$authProvider","clientId",function(t,n){t.oauth2({name:"soundcloud",url:"/auth/soundcloud",clientId:n,redirectUri:window.location.origin,authorizationEndpoint:"https://soundcloud.com/connect"})}]).run(["$rootScope",function(t){t.messages={},t.$on("$stateChangeSuccess",function(){t.messages={}})}]),angular.module("app.controllers",[]).controller("MainCtrl",["$rootScope","$scope","$http","$auth","Account","$state",function(t,n,e,r,o,a){n.login=function(){return r.authenticate("soundcloud").then(function(){n.getProfile().then(function(){a.go("trending")})}).catch(function(n){n&&(t.messages.error=n.data.errors)})},n.logout=function(){return r.logout().then(function(){n.user=null,a.go("login")})},n.isAuthenticated=function(){return r.isAuthenticated()},n.getProfile=function(){return o.get().then(function(t){return n.user=t.data,n.user}).catch(function(n){n&&(t.messages.error=n.data.errors)})}}]).controller("AuthCtrl",["$scope","$http",function(){}]).controller("NavCtrl",["$rootScope","$scope","$state","Soundcloud",function(t,n,e){e.go("trending.week"),n.activeTab=function(t){return t===e.current.name},n.$on("data:notFound",function(){t.messages.noDataFound=!0}),n.$on("data:follow",function(){t.messages.follow=!0}),n.$on("data:error",function(n,e){console.log(e),t.messages.error=e.data.errors})}]).controller("TrendingCtrl",["$scope","Soundcloud","timeframe","$state",function(t,n,e){t.showLoading=!0,t.getProfile().then(function(r){n.parseUser(r.uid,e.time).then(function(n){t.showLoading=!1,t.songs=n,n.length?n.length<10&&t.$emit("data:follow"):t.$emit("data:notFound")}).catch(function(n){n&&t.$emit("data:error",n)})})}]),angular.module("app.directives",[]),angular.module("app.filters",[]),angular.module("app.services",[]).constant("clientId","863060121a2ffb5d258e7a793da0546b").constant("soundcloudUrl","//api.soundcloud.com/").factory("Soundcloud",["$http","$q","clientId","soundcloudUrl",function(t,n,e,r){var o={client_id:e},a=function(t,n){return u(t).then(function(t){return i(t)}).then(function(t){return c(_.flatten(t))}).then(function(t){return s(t,n)})},u=function(n){return t.get(r+"users/"+n+"/followings.json",{params:o}).then(function(t){return t.data})},i=function(t){return n.all(_.map(t,function(t){return l(t.id)}))},l=function(e){return n.all([t.get(r+"users/"+e+"/favorites.json",{params:o}),t.get(r+"users/"+e+"/tracks.json",{params:o})])},c=function(t){return _(t).map(function(t){return t.data?t.data:void 0}).flatten().reject(function(t){return!t.playback_count}).uniq("id")},s=function(t,n){var e=new Date;return n="day"===n?e.setDate(e.getDate()-1):"week"===n?e.setDate(e.getDate()-7):"month"===n?e.setMonth(e.getMonth()-1):null,t.reject(function(t){return n?Date.parse(t.created_at)<n:void 0}).sortBy("playback_count").reverse().first(10).value()};return{parseUser:a}}]).factory("Account",["$http",function(t){return{get:function(){return t.get("/api/me")}}}]);