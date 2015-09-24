export default function router($stateProvider) {
  $stateProvider.state('main', {
    url: '/#',
    abstract: false,
    templateUrl: 'app/main.html',
  }).state('main.index', {
    url: '^/',
    views: {
      'navbar@main': {
        templateUrl: 'app/navber/navbar.html',
        controllerAs: 'navbar',
        controller: 'navbarController',
      },
      'func@main': {
        templateUrl: 'app/func/func.html',
        controllerAs: 'func',
        controller: 'funcController',
      },
      'capture@main': {
        templateUrl: 'app/capture/capture.html',
        controllerAs: 'capture',
        controller: 'captureController',
      },
    },
  });
}

router.$inject = ['$stateProvider'];
