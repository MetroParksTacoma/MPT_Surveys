var mptSurveys = angular.module('mptSurveys', ['ngRoute', 'chart.js'])
  .config(function($routeProvider) {

    $routeProvider.otherwise({redirectTo: '/home'});

    $routeProvider.when('/home', {
      templateUrl: 'static/templates/home.template.html',
      controller: 'homeController'
    });

    $routeProvider.when('/household', {
      templateUrl: 'static/templates/household.template.html',
      controller: 'householdController'
    });

    $routeProvider.when('/age', {
      templateUrl: 'static/templates/age.template.html',
      controller: 'ageController'
    });

  })
  .factory('dataService', function() {
    var data;
    return {
      data: data
    };
  })
  .directive('demoNav', function() {
    return {
      restrict: 'E',
      templateUrl: 'static/templates/demo-nav.directive.template.html',
      controller: function($scope, $location) {
        $scope.showPage = function(page) {
          if (page === $scope.currentPage) return;
          $location.path('/' + page);
        };
      },
      scope: {
        currentPage: '=?'
      }
    };
  })
  .controller('homeController', function($scope, $http, $location, dataService) {

    $scope.loadingData = true;
    $scope.currentPage = 'info';

    if (dataService.data) {
      $scope.loadingData = false;
    } else {
      $http.get('http://localhost:4545/api/results/demographics')
        .then(function(response) {
          $scope.loadingData = false;
          dataService.data = response.data;
        }, function(response){
          console.log(response);
        });
    }

  })
  .controller('householdController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var q19 = dataService.data.q19;
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

  })
  .controller('ageController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var ageSum = 0;
    var ageCount = 0;
    var q20 = _.sortBy(dataService.data.q20, 'age');
    $scope.q20Series = ['Q20'];
    $scope.q20Labels = [];
    $scope.q20Data = [];
    _.forEach(q20, function(item) {
      $scope.q20Labels.push(item.age);
      $scope.q20Data.push(item.count);
      ageSum += item.age;
      ageCount++;
    });
    $scope.q20Average = roundTo((ageSum/ageCount), 1);

  });



function roundTo(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}
