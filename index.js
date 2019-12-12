// read the csv file

const csv = require('csv-parser')
const fs = require('fs')
const results = [];
// set column present to false
var anotherPresent = false;
var facilitiesPresent = false;
var staffPresent = false;
var safetyPresent = false;
var infoPresent = false;
var somethingElsePresent = false;

// 
 
fs.createReadStream('FMC-data/2-answers.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    var firstRowData = results[0];
    var csvOut = new Object();
    var csvInData = results[0];


 //   var myResults = JSON.parse(results);
    var myResults = JSON.stringify(results);

    console.log('myResults' + myResults );
    console.log('results.another_reason ' + csvInData.another_reason );


  csvOut.submissionId = csvInData.submission_id;
  csvOut.court = csvInData.court;
  csvOut.user_type = csvInData.user_type;
  str = JSON.stringify(csvOut);
  console.log('csvOut ' + str);

 
  if ('another_reason' in csvInData) {
    console.log('another ')
    csvOut.another_reason = csvInData.another_reason;
    }
  else {
    csvOut.another_reason = "";
    }

  if ('facilities' in csvInData) {
    console.log('facilities ')
    csvOut.facilities = csvInData.facilites;
    }
  else {
    csvOut.facilities = "";
    }

  if ('staff' in csvInData) {
    console.log('staff ')
    csvOut.staff = csvInData.staff;
    }
  else {
    csvOut.staff = "";
    }

  if ('security_and_safety' in csvInData) {
    console.log('safety ')
    csvOut.security_and_safety = csvInData.security_and_safety;
    }
  else {
    csvOut.security_and_safety = "";
    }

  if ('information_and_guidance' in csvInData) {
    console.log('info ')
    csvOut.information_and_guidance = csvInData.information_and_guidance;
    }
  else {
    csvOut.information_and_guidance = "";
    }

  if ('something_else' in csvInData) {
    console.log('something ')
    csvOut.something_else = csvInData.something_else;
    }
  else {
    csvOut.something_else = "";
    }
  str = JSON.stringify(csvOut);
  console.log('csvOut ' + str);


});

  