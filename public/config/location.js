export default function location($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}

location.$inject = ['$urlRouterProvider', '$locationProvider'];
