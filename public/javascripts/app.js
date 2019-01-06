'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ngRoute',

  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'angularModalService',

  // 3rd party dependencies
  'btford.socket-io'
]);
