const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const csvToJson = require('csvtojson')
const excelJS = require('exceljs');
// var dataOut = new Object();
// let csvDataIn = new Object();
var csvDataIn = [];
var fileList = [];
var xlsxFileNameCourt;

const directoryPath = path.join(__dirname, 'FMC-data');

function readDirectory (directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir( directoryPath, function( error, files) {
      if ( error ) {
          return console.log("Error reading directory contents.");
      };
      console.log('files ' + files)
      resolve(files)

    });
  });
};

function readCsv(csvDataIn) {
  if (error) {
    return console.log('cannot readCsv: ' + error);
  };   
  csvToJson()
  .fromFile(csvFiles)
  .then((csvDataIn)=>{
    console.log('csvDataIn csvToJson ' + JSON.stringify(csvDataIn))
    writeRow(csvDataIn, function (error, dataOut) {
      if (error) {
        return console.log('cannot writeRow: ' + error);
      };
    });
  });      
};

function createRow(csvDataIn) {
  console.log('**************** createRow ************')

  console.log('csvDataIn createRow ' + JSON.stringify(csvDataIn));
  console.log(csvDataIn);
  var dataOut = [];

  var dateTime = csvDataIn.submission_at.replace(/[T,Z]/g," ");
  dataOut.timestamp = dateTime;
  dataOut.submission_id = csvDataIn.submission_id;
  dataOut.court = csvDataIn.court;
  dataOut.user_type = csvDataIn.user_type;

  if (csvDataIn.hasOwnProperty('another_reason')) {
//      console.log('another ')
    dataOut.another_reason = csvDataIn.another_reason;
    }
  else {
    dataOut.another_reason = "";
    }

  if (csvDataIn.hasOwnProperty('facilities')) {
//      console.log('facilities ')
    dataOut.facilities = csvDataIn.facilities;
    }
  else {
    dataOut.facilities = "";
    }

  if (csvDataIn.hasOwnProperty('staff'))  {
//      console.log('staff ')
    dataOut.staff = csvDataIn.staff;
    }
  else {
    dataOut.staff = "";
    }

  if (csvDataIn.hasOwnProperty('security_and_safety')) {
//      console.log('safety ')
    dataOut.security_and_safety = csvDataIn.security_and_safety;
    }
  else {
    dataOut.security_and_safety = "";
    }

  if (csvDataIn.hasOwnProperty('information_and_guidance')) {
//      console.log('info ')
    dataOut.information_and_guidance = csvDataIn.information_and_guidance;
    }
  else {
    dataOut.information_and_guidance = "";
    }

  if (csvDataIn.hasOwnProperty('something_else'))  {
//      console.log('something ')
    dataOut.something_else = csvDataIn.something_else;
    }
  else {
    dataOut.something_else = "";
    }

  dataOut.what_happened = csvDataIn.what_happened;
  dataOut.want_reply = csvDataIn.want_reply;

  if (csvDataIn.hasOwnProperty('email_address'))  {
//      console.log('email_address ')
    dataOut.email_address = csvDataIn.email_address;
    }
  else {
    dataOut.email_address = "";
  }

  str = JSON.stringify(dataOut);
  console.log('dataOut createRow ' + str);
  return dataOut

};

readDirectory(directoryPath)
.then(function(files) {
  console.log('files ' + files)

  // only select the csv files

  for (var i=0; i<files.length; i++) {
    let csvFileLocation = directoryPath + '/' + files[i];
    let isCsvFile = csvFileLocation.includes(".csv")
    console.log('csvFileLocation in for loop ' + csvFileLocation)
    if (isCsvFile) {
      console.log('* csv file *' + csvFileLocation);
      csvFiles.push(csvFileLocation)}
    return csvFiles
  };
})

.then(function(csvFiles){
  // read all the csv files and add rows to the array
  return Promise.all(
    csvFiles.map(function(csvFiles) {
      return readCsv(csvFiles)
    })
  )
})
.then(function(csvDataIn) {
  return Promise.all(
    csvDataIn.map(function(csvDataIn ) {
      return createRow(csvDataIn)
    })
  )
})
.catch(function(error) {
  console.log(error)
})

