var mptSurveys = angular.module('mptSurveys', ['ngRoute'])
  .config(function($routeProvider, $compileProvider, $httpProvider) {

    $routeProvider.otherwise({redirectTo: '/home'});

    $routeProvider.when('/home', {
      templateUrl: 'static/templates/home.template.html',
      controller: 'homeController'
    });

  })
  .controller('homeController', function($scope, $http) {

    //

  });
