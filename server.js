var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

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

app.get('/api/results', function(req, res) {
  db.collection('results').find({}).limit(10).toArray(function(err, results) {
    if (err) console.log(err);
    res.status(200).json(results);
  });
});

app.listen(port, function() {
  console.log('api server running on port ' + port.toString());
});
