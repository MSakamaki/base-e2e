import angular from 'angular';
import 'angular-ui-router';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-resource';

// angular initizalized
var app = angular.module('kac.front.report', ['ui.router', 'ngMaterial', 'ngResource']);

// routing
import router   from 'config/router';
app.config(router);

// location
import Location from 'config/location';
app.config(Location);

/* factory:start */
import navbarFactory from 'app/navber/navbar.factory.js';
app.factory('navbarFactory', navbarFactory);
/* factory:end */

/* controller:start */
import captureController from 'app/capture/capture.controller.js';
app.controller('captureController', captureController);
import funcController from 'app/func/func.controller.js';
app.controller('funcController', funcController);
import navbarController from 'app/navber/navbar.controller.js';
app.controller('navbarController', navbarController);
/* controller:end */

