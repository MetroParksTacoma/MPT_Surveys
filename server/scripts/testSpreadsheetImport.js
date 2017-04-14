var path = require('path');
var mongoXlsx = require('mongo-xlsx');

var dataPath = path.resolve(__dirname, '../../data');

mongoXlsx.xlsx2MongoData(dataPath + '/TacomaParksSurveyData_for_MLCPP.xlsx', null, function(err, mongoData) {
  if (err) {
    console.log('ERROR:');
    console.log(err);
  }
  console.log('mongoData:');
  console.log(mongoData);
});
