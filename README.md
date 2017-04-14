# MPT_Surveys

To import data from CSV file to Mongo:

```
mongoimport --db mptsurveys --collection results --type csv --headerline --file ./data/TacomaParksSurveyData_for_MLCPP.csv
```
