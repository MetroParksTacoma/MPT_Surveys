var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var _ = require('lodash');

var client = mongodb.MongoClient;
var app = express();
var port = 4545
var db;

client.connect('mongodb://localhost/mptsurveys', function(err, _db) {
  if (err) {
    console.log('DB ERROR:');
    console.log(err);
  }
  db = _db;
  console.log('connected to mongodb...');
});

app.use(express.static(__dirname + '/client-angular'));

app.get('/api/results', function(req, res) {
  db.collection('results').find({}).limit(10).toArray(function(err, results) {
    if (err) console.log(err);
    res.status(200).json(results);
  });
});

app.get('/api/results/demographics', function(req, res) {
  db.collection('results')
    .find({}, {
      "ETCID": 1,
      "Q19_HOUSEHOLD _01_": 1,
      "Q19_HOUSEHOLD _02_": 1,
      "Q19_HOUSEHOLD _03_": 1,
      "Q19_HOUSEHOLD _04_": 1,
      "Q19_HOUSEHOLD _05_": 1,
      "Q19_HOUSEHOLD _06_": 1,
      "Q19_HOUSEHOLD _07_": 1,
      "Q19_HOUSEHOLD _08_": 1,
      "Q19_HOUSEHOLD _09_": 1,
      "Q19_HOUSEHOLD _10_": 1,
      "Q19_HOUSEHOLD _11_": 1,
      "Q20_AGE": 1,
      "Q21_GENDER_Code_": 1,
      "Q22_INCOME_Code_": 1,
      "Q23_LIVED": 1,
      "Q24_HISPANIC_Code_": 1,
      "Q25_ETHNICITY _01_": 1,
      "Q25_ETHNICITY _02_": 1,
      "Q25_ETHNICITY _03_": 1,
      "Q25_ETHNICITY _04_": 1,
      "Q25_ETHNICITY _05_": 1,
      "Q25_ETHNICITY _06_": 1,
      "Q25_06_OTHER": 1,
      "Q26_MILITARY_Code_": 1,
      "AREA_Code_": 1,
      "AREA": 1,
      "ZIP_CODE": 1
    })
    .toArray(function(err, results) {
      if (err) return console.log(err);
      var _results = processDemographics(results);
      console.log(_results);
      res.status(200).json(_results);
    });
});

app.listen(port, function() {
  console.log('api server running on port ' + port.toString());
});

function processDemographics(results) {
  var etcIds = [];
  var q19 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    a6: 0,
    a7: 0,
    a8: 0,
    a9: 0,
    a10: 0,
    a11: 0
  };
  var q20 = [];
  var q21 = {
    mCount: 0,
    fCount: 0
  };
  var q22 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    a6: 0
  };
  var q23 = [];
  var q24 = {
    yesCount: 0,
    noCount: 0
  };
  var q25 = {
    whiteCount: 0,
    asianCount: 0,
    pacIslandCount: 0,
    blackCount: 0,
    nativeCount: 0,
    otherCount: 0
  };
  var q25Others = [];
  var q26 = {
    yesCount: 0,
    noCount: 0
  };
  var areas = [];
  var zipcodes = [];

  _.forEach(results, function(item) {
    // ETCID
    etcIds.push(item['ETCID']);
    // Q19
    if (item['Q19_HOUSEHOLD _01_'] !== '') q19.a1 += item['Q19_HOUSEHOLD _01_'];
    if (item['Q19_HOUSEHOLD _02_'] !== '') q19.a2 += item['Q19_HOUSEHOLD _02_'];
    if (item['Q19_HOUSEHOLD _03_'] !== '') q19.a3 += item['Q19_HOUSEHOLD _03_'];
    if (item['Q19_HOUSEHOLD _04_'] !== '') q19.a4 += item['Q19_HOUSEHOLD _04_'];
    if (item['Q19_HOUSEHOLD _05_'] !== '') q19.a5 += item['Q19_HOUSEHOLD _05_'];
    if (item['Q19_HOUSEHOLD _06_'] !== '') q19.a6 += item['Q19_HOUSEHOLD _06_'];
    if (item['Q19_HOUSEHOLD _07_'] !== '') q19.a7 += item['Q19_HOUSEHOLD _07_'];
    if (item['Q19_HOUSEHOLD _08_'] !== '') q19.a8 += item['Q19_HOUSEHOLD _08_'];
    if (item['Q19_HOUSEHOLD _09_'] !== '') q19.a9 += item['Q19_HOUSEHOLD _09_'];
    if (item['Q19_HOUSEHOLD _10_'] !== '') q19.a10 += item['Q19_HOUSEHOLD _10_'];
    if (item['Q19_HOUSEHOLD _11_'] !== '') q19.a11 += item['Q19_HOUSEHOLD _11_'];
    // Q20
    if (item['Q20_AGE'] !== '') {
      var tempQ20 = _.find(q20, function(o) {
        return o.age === item['Q20_AGE'];
      });
      if (tempQ20) {
        tempQ20.count++;
      } else {
        q20.push({age: item['Q20_AGE'], count: 1});
      }
      tempQ20 = null;
    }
    // Q21
    if (item['Q21_GENDER_Code_'] === 1) {
      q21.mCount++;
    } else if (item['Q21_GENDER_Code_'] === 2) {
      q21.fCount++;
    }
    // Q22
    if (item['Q22_INCOME_Code_'] === 1) q22.a1++;
    if (item['Q22_INCOME_Code_'] === 2) q22.a2++;
    if (item['Q22_INCOME_Code_'] === 3) q22.a3++;
    if (item['Q22_INCOME_Code_'] === 4) q22.a4++;
    if (item['Q22_INCOME_Code_'] === 5) q22.a5++;
    if (item['Q22_INCOME_Code_'] === 6) q22.a6++;
    // Q23
    var tempQ23 = _.find(q23, function(o) {
      return o.years === item['Q23_LIVED'];
    });
    if (tempQ23) {
      tempQ23.count++;
    } else {
      q23.push({years: item['Q23_LIVED'], count: 1});
    }
    tempQ23 = null;
    // Q24
    if (item['Q24_HISPANIC_Code_'] === 1) {
      q24.yesCount++;
    } else if (item['Q24_HISPANIC_Code_'] === 2) {
      q24.noCount++;
    }
    // Q25
    if (item['Q25_ETHNICITY _01_'] !== '') q25.whiteCount++;
    if (item['Q25_ETHNICITY _02_'] !== '') q25.asianCount++;
    if (item['Q25_ETHNICITY _03_'] !== '') q25.pacIslandCount++;
    if (item['Q25_ETHNICITY _04_'] !== '') q25.blackCount++;
    if (item['Q25_ETHNICITY _05_'] !== '') q25.nativeCount++;
    if (item['Q25_ETHNICITY _06_'] !== '') q25.otherCount++;
    if (item['Q25_06_OTHER'] !== '') q25Others.push(item['Q25_06_OTHER']);
    // Q26
    if (item['Q26_MILITARY_Code_'] === 1) {
      q26.yesCount++;
    } else if (item['Q26_MILITARY_Code_'] === 2) {
      q26.noCount++;
    }
    // AREA
    var tempArea = _.find(areas, function(o) {
      return o.areaCode === item['AREA_Code_'];
    });
    if (tempArea) {
      tempArea.count++;
    } else {
      areas.push({areaCode: item['AREA_Code_'], area: item['AREA'], count: 1});
    }
    tempArea = null;
    // ZIP
    var tempZip = _.find(zipcodes, function(o) {
      return o.zipcode === item['ZIP_CODE'];
    });
    if (tempZip) {
      tempZip.count++;
    } else {
      zipcodes.push({zipcode: item['ZIP_CODE'], count: 1});
    }
    tempZip = null;
  });

  var _results = {
    etcIds: etcIds,
    q19: q19,
    q20: q20,
    q21: q21,
    q22: q22,
    q23: q23,
    q24: q24,
    q25: q25,
    q25Others: q25Others,
    q26: q26,
    areas: areas,
    zipcodes: zipcodes
  };

  return _results;
}
