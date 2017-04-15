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

    $routeProvider.when('/gender', {
      templateUrl: 'static/templates/gender.template.html',
      controller: 'genderController'
    });

    $routeProvider.when('/income', {
      templateUrl: 'static/templates/income.template.html',
      controller: 'incomeController'
    });

    $routeProvider.when('/years', {
      templateUrl: 'static/templates/years.template.html',
      controller: 'yearsController'
    });

    $routeProvider.when('/ethnicity', {
      templateUrl: 'static/templates/ethnicity.template.html',
      controller: 'ethnicityController'
    });

    $routeProvider.when('/military', {
      templateUrl: 'static/templates/military.template.html',
      controller: 'militaryController'
    });

  })
  .factory('dataService', function($window) {

    var data;

    var ioHost = 'http://localhost:4545';
    // var ioHost = 'http://ec2-52-10-158-21.us-west-2.compute.amazonaws.com:4545';

    var saveData = function(_data) {
      $window.sessionStorage.setItem('resultsData', JSON.stringify(_data));
      data = _data;
    };

    var loadData = function() {
      data = JSON.parse($window.sessionStorage.getItem('resultsData'));
    };

    loadData();

    return {
      data: data,
      ioHost: ioHost,
      saveData: saveData,
      loadData: loadData
    };

  })
  .directive('pdf', function(dataService) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var url = scope.$eval(attrs.src);
        element.replaceWith('<object type="application/pdf" data="' + dataService.ioHost + '/' + url + '" width="600" height="500"></object>');
      }
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
  .controller('homeController', function($scope, $http, $location, $sce, $timeout, dataService) {

    $scope.loadingData = true;
    $scope.currentPage = 'info';

    if (dataService.data) {
      $scope.loadingData = false;
      $scope.responseCount = dataService.data.etcIds.length;
    } else {
      $http.get(dataService.ioHost + '/api/results/demographics')
        .then(function(response) {
          $scope.loadingData = false;
          dataService.data = response.data;
          dataService.saveData(response.data);
          $scope.responseCount = dataService.data.etcIds.length;
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

  })
  .controller('genderController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var q21 = dataService.data.q21;

    $scope.labels = ['Male', 'Female'];
    $scope.data = [q21.mCount, q21.fCount];

    $scope.fCount = q21.fCount;
    $scope.fPercent = roundTo(q21.fCount*100/(q21.fCount+q21.mCount), 1);

    $scope.mCount = q21.mCount;
    $scope.mPercent = roundTo(q21.mCount*100/(q21.fCount+q21.mCount), 1);

  })
  .controller('incomeController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var q22 = dataService.data.q22;

    $scope.series = ['Q22'];
    $scope.labels = [
      'Under $25k',
      '$25-49k',
      '$50-74k',
      '$75-99k',
      '$100-149k',
      '$150k+'
    ];
    $scope.data = [q22.a1, q22.a2, q22.a3, q22.a4, q22.a5, q22.a6];
    $scope.options = {
      scales: {
        yAxes: [{ticks: {beginAtZero: true}}]
      }
    };

  })
  .controller('yearsController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var yearsSum = 0;
    var yearsCount = 0;
    var q23 = _.sortBy(dataService.data.q23, 'years');
    $scope.series = ['Q23'];
    $scope.labels = [];
    $scope.data = [];
    _.forEach(q23, function(item) {
      $scope.labels.push(item.years);
      $scope.data.push(item.count);
      yearsSum += parseInt(item.years);
      yearsCount++;
    });
    $scope.yearsAverage = roundTo((yearsSum/yearsCount), 1);

  })
  .controller('ethnicityController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var q24 = dataService.data.q24;
    $scope.hispanicLabels = ['Yes', 'No'];
    $scope.hispanicData = [q24.yesCount, q24.noCount];
    $scope.hispanicYesCount = q24.yesCount;
    $scope.hispanicYesPercent = roundTo(q24.yesCount*100/(q24.yesCount+q24.noCount), 1);
    $scope.hispanicNoCount = q24.noCount;
    $scope.hispanicNoPercent = roundTo(q24.noCount*100/(q24.yesCount+q24.noCount), 1);

    var q25 = dataService.data.q25;
    $scope.ethnicityLabels = [
      'White/Caucasian',
      'Asian',
      'Pacific Islander',
      'African American/Black',
      'Native American',
      'Other'
    ];
    $scope.ethnicityData = [
      q25.whiteCount,
      q25.asianCount,
      q25.pacIslandCount,
      q25.blackCount,
      q25.nativeCount,
      q25.otherCount
    ];
    $scope.totalCount = q25.whiteCount + q25.asianCount + q25.pacIslandCount + q25.blackCount + q25.nativeCount + q25.otherCount;
    $scope.whiteCount = q25.whiteCount;
    $scope.whitePercent = roundTo(q25.whiteCount*100/$scope.totalCount, 1);
    $scope.asianCount = q25.asianCount;
    $scope.asianPercent = roundTo(q25.asianCount*100/$scope.totalCount, 1);
    $scope.pacIslandCount = q25.pacIslandCount;
    $scope.pacIslandPercent = roundTo(q25.pacIslandCount*100/$scope.totalCount, 1);
    $scope.blackCount = q25.blackCount;
    $scope.blackPercent = roundTo(q25.blackCount*100/$scope.totalCount, 1);
    $scope.nativeCount = q25.nativeCount;
    $scope.nativePercent = roundTo(q25.nativeCount*100/$scope.totalCount, 1);
    $scope.otherCount = q25.otherCount;
    $scope.otherPercent = roundTo(q25.otherCount*100/$scope.totalCount, 1);

  })
  .controller('militaryController', function($scope, $location, dataService) {

    if (!dataService.data) return $location.path('/home');

    var q26 = dataService.data.q26;

    $scope.labels = ['Yes', 'No'];
    $scope.data = [q26.yesCount, q26.noCount];

    $scope.yesCount = q26.yesCount;
    $scope.yesPercent = roundTo(q26.yesCount*100/(q26.yesCount+q26.noCount), 1);

    $scope.noCount = q26.noCount;
    $scope.noPercent = roundTo(q26.noCount*100/(q26.yesCount+q26.noCount), 1);

  });



function roundTo(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}
