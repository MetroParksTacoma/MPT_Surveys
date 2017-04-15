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
        $scope.loadingData = false;
        processData(response.data);
      }, function(response){
        console.log(response);
      });

    function processData(data) {
      console.log(data);
      var q19 = data.q19;
      $scope.q19Series = ['Q19'];
      $scope.q19Labels = [
        'Under 5',
        '5 - 9',
        '10 - 14',
        '15 - 19',
        '20 - 24',
        '25 - 34',
        '35 - 44',
        '45 - 54',
        '55 - 64',
        '65 - 74',
        '75+',
      ];
      $scope.q19Data = [q19.a1, q19.a2, q19.a3, q19.a4, q19.a5, q19.a6, q19.a7, q19.a8, q19.a9, q19.a10, q19.a11];
    }

  });
