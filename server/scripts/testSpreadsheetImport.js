var path = require('path');
var mongoose = require('mongoose');
var mongoXlsx = require('mongo-xlsx');

mongoose.connect('mongodb://localhost/mpt-surveys');

var dataPath = path.resolve(__dirname, '../../data');

mongoXlsx.xlsx2MongoData(dataPath + '/TacomaParksSurveyData_for_MLCPP.xlsx', null, function(err, mongoData) {
  if (err) {
    console.log('ERROR:');
    console.log(err);
  }
  // console.log('mongoData:');
  // console.log(mongoData[0]);
  mongoose.save(mongoData);
});
