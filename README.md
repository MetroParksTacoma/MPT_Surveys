# MPT_Surveys

This project is a small web app built to analyze Metro Parks Tacoma survey data as part of a Metro Parks Tacoma Hackathon in April 2017. I loaded the survey data into a MongoDb database and compiled statistics for the demographics questions. The results are shown in a series of charts in an AngularJS web app.

### Live Demo
http://ec2-52-10-158-21.us-west-2.compute.amazonaws.com/

### Requirements
- Node.js
- MongoDb

To run the app locally, clone the repo, run `cd MPT_Surveys && npm install`, import the data to MongoDb (see below), and run `node server.js`. By default, the app will be running on `http://localhost:4545`.

To import data from CSV file to MongoDb:

```
mongoimport --db mptsurveys --collection results --type csv --headerline --file ./data/TacomaParksSurveyData_for_MLCPP.csv
```

Thank you Metro Parks Tacoma for putting on this awesome event!
