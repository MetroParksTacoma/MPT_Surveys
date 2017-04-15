var mptSurveys = angular.module('mptSurveys', ['ngRoute', 'chart.js'])
  .config(function($routeProvider, $compileProvider, $httpProvider) {

    $routeProvider.otherwise({redirectTo: '/home'});

    $routeProvider.when('/home', {
      templateUrl: 'static/templates/home.template.html',
      controller: 'homeController'
    });

  })
  .controller('homeController', function($scope, $http) {

    $scope.loadingData = true;

    $http.get('http://localhost:4545/api/results/demographics')
      .then(function(response) {
        console.log(response.data);
      }, function(response){
        console.log(response);
      });

  });
