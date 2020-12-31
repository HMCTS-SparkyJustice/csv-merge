const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const csvToJson = require('csvtojson')
const excelJS = require('exceljs');

var dataOut = [];
var csvIn = [];
var fileList = [];
var xlsxFileNameCourt;

const directoryPath = path.join(__dirname, 'FMC-data');

// read the csv file

function readCsv(csvFileLocation) {
  console.log('**************** readCsv ************');
  console.log('csvFileLocation readCsv ' + csvFileLocation);

  csvToJson()
  .fromFile(csvFileLocation)
  .then((dataIn)=>{
    let csvIn = dataIn;
  });
  console.log('csvIn type = ' + typeof(csvIn));
  console.log('csvIn csvToJson ' + JSON.stringify(csvIn));
  return csvIn;


}; // end readCsv
function readDirectory (directoryPath) {
  return new Promise(function(resolve,reject){
    fs.readdir(directoryPath, function( error, files) {
      if ( error )
        return console.log("Error reading directory contents." + error);
      else
        resolve(files);
    });
  });
};

readCsv(csvFiles, function (error, csvDataIn) {
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
});

      // create the row for output
      createRow(csvIn, function (error, dataOut) {
        if (error) {
          return console.log('cannot createRow: ' + error);
        };
      });
      const allData = {...csvIn, ...dataOut};
      console.log('allData ' + allData);
})

readDirectory(directoryPath)
.then(function(files) {
  console.log('files ' + files)

  // only select the csv files
  const csvFiles = []
  for (var i=0; i<files.length; i++) {
    let csvFileLocation = directoryPath + '/' + files[i];
    var isCsvFile = csvFileLocation.includes(".csv")
    console.log('csvFileLocation in for loop ' + csvFileLocation);
    if (isCsvFile) {
      console.log('* csv file *' + csvFileLocation);
      csvFiles.push(csvFileLocation)}
    return csvFiles
  };
});

.then(function(csvFiles){
  // read all the csv files and add rows to the array
    return Promise.all(function(csvFiles) {
      csvFiles.map(function(csvFiles) {
        return readCsv(csvFiles)
      })
    })
  })
.then(function(csvDataIn))
    
  console.log('**************** main ************')

  // read all the files in the directory

    // process each file

    for (var i=0; i<files.length; i++) {
      let csvFileLocation = directoryPath + '/' + files[i];
      var isCsvFile = csvFileLocation.includes(".csv")
      console.log('csvFileLocation in for loop ' + csvFileLocation);
      if (isCsvFile) {
        console.log('* csv file *' + csvFileLocation);
          // read the csv file
        readCsv(csvFileLocation, function (error, csvIn) {
          if (error) {
            return console.log('cannot readCsv: ' + error);
          };         
        });
        console.log('csvIn main ' + JSON.stringify(csvIn));          
        console.log(csvIn);

        // create the row for output
        createRow(csvIn, function (error, dataOut) {
          if (error) {
            return console.log('cannot createRow: ' + error);
          };
        });
        const allData = {...csvIn, ...dataOut};
        console.log('allData ' + allData);

        
        // write the row object to the spreadsheet if it exists if not error

        return new Promise( function (resolve, reject ) {
          try {
            fs.accessSync(xlsxFileLocation);
            console.log('can read/write')
            writeXlsx(xlsxFileLocation, allData, function (error, retval) {
              if (error) {
                return console.log('cannot writeXlsx: ' + error);
              }          
            });
          } catch (err) {
          console.error('no access!')
          };
        }); // end promise
      } // end if csvFile
      else {
        console.log('* non csv file found *' + csvFileLocation)
        // 
      }; // end else csvFile
    }; // end for loop for files
  }); // end readdir
};  // end main



// create the row object

function createRow(csvIn) {
  console.log('**************** createRow ************')

  console.log('csvIn createRow ' + JSON.stringify(csvIn));
  console.log(csvIn);

  var dateTime = csvIn[0].submission_at.replace(/[T,Z]/g," ");
  dataOut.timestamp = dateTime;
  dataOut.submission_id = csvIn[0].submission_id;
  dataOut.court = csvIn[0].court;
  dataOut.user_type = csvIn[0].user_type;

  if (csvIn[0].hasOwnProperty('another_reason')) {
//      console.log('another ')
    dataOut.another_reason = csvIn[0].another_reason;
    }
  else {
    dataOut.another_reason = "";
    }

  if (csvIn[0].hasOwnProperty('facilities')) {
//      console.log('facilities ')
    dataOut.facilities = csvIn[0].facilities;
    }
  else {
    dataOut.facilities = "";
    }

  if (csvIn[0].hasOwnProperty('staff'))  {
//      console.log('staff ')
    dataOut.staff = csvIn[0].staff;
    }
  else {
    dataOut.staff = "";
    }

  if (csvIn[0].hasOwnProperty('security_and_safety')) {
//      console.log('safety ')
    dataOut.security_and_safety = csvIn[0].security_and_safety;
    }
  else {
    dataOut.security_and_safety = "";
    }

  if (csvIn[0].hasOwnProperty('information_and_guidance')) {
//      console.log('info ')
    dataOut.information_and_guidance = csvIn[0].information_and_guidance;
    }
  else {
    dataOut.information_and_guidance = "";
    }

  if (csvIn[0].hasOwnProperty('something_else'))  {
//      console.log('something ')
    dataOut.something_else = csvIn[0].something_else;
    }
  else {
    dataOut.something_else = "";
    }

  dataOut.what_happened = csvIn[0].what_happened;
  dataOut.want_reply = csvIn[0].want_reply;

  if (csvIn[0].hasOwnProperty('email_address'))  {
//      console.log('email_address ')
    dataOut.email_address = csvIn[0].email_address;
    }
  else {
    dataOut.email_address = "";
  }

  str = JSON.stringify(dataOut);
  console.log('dataOut createRow ' + str);

}; // end createRow

// initialise spreadsheet file - if it doesn't exist output an error

function initWorkbook (path) {
/*  var workbook = new excelJS.Workbook();
  workbook.creator = 'HMCTS';
  workbook.lastModifiedBy = 'HMCTS';
  workbook.created = new Date();
  workbook.modified = new Date();
  var workSheet = workbook.addWorksheet('courtName');
  var reColumns=[
      {header:'Date submitted',key:'dateSubmitted'},
      {header:'User type',key:'userType'},
      {header:'Another user type',key:'anotherUserType'},
      {header:'About facilities',key:'aboutFacilities'},
      {header:'About staff',key:'aboutStaff'},
      {header:'About security and safety',key:'aboutSecuritySafety'},
      {header:'About information and guidance',key:'aboutInformationGuidance'},
      {header:'About something else',key:'aboutSomethingElse'},
      {header:'More information',key:'moreInformation'}
  ];
  */
  fs.access(path, fs.F_OK, (err,spreadsheetExists) => {
  if (err) {
    console.error(err)
    spreadsheetExists = false;
  }
    spreadsheetExists = true;
  
  })

}; // end initWorkbook
function writeXlsx(xlsxFileNameCourt, dataOut) {
  console.log('**************** writeXlsx ************')
  console.log('xlsxFileNameCourt ' + xlsxFileNameCourt );


  // write to court file
  str = JSON.stringify(dataOut);
  console.log('dataOut writeXlsx ' + str);
  //  const xlsxFileNameCourt = path.join(__dirname, dataOut.court, '-fmc-responses.xlsx');
//  const createCsvWriterCourt = require('csv-writer').createObjectCsvWriter;
  var workbook = new excelJS.Workbook();
  var worksheet = workbook.getWorksheet(1);
  w
orkbook.xlsx.readFile(xlsxFileNameCourt)
  .then(function() {
    console.log('writexlsx worksheet ' + worksheet);
    worksheet.addRow(dataOut);
    worksheet.commit();

    workbook.xlsx.writeFile(xlsxFileNameCourt)
    .then(() => {
      console.log("saved");
    })
    .catch((error) => {
      console.log("error", error);
    });
  });
};
// end writeXlsx




console.log('**************** main is called ************')

main ();
