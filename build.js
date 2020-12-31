const path = require('path');
const fs = require('fs');
const csvToJson = require('csvtojson')
const excelJS = require('exceljs');


const directoryPath = path.join(__dirname, 'FMC-data-test');
const pathExtensionName = ".csv"
const xlsxFile = path.join(__dirname, 'FMC-submissions.xlsx');

//read the files from the directory

function readDirectory (directoryPath) {
	return new Promise(function(resolve, reject) {
		fs.readdir( directoryPath, function( error, files) {
	    if ( error ) {
	        return console.log("Error reading directory contents.");
	    };

			resolve(files)

		});
	});
};

function readFile(csvFilename) {  
	return new Promise(function(resolve,reject) {
	  csvToJson()
	  .fromFile(csvFilename)
	  .then(function(csvData) {
//	    console.log('csvData csvToJson ' + JSON.stringify(csvData))
	    resolve(csvData)
	  })
	})
};	


function createRow (submissionData) {
	return new Promise(function(resolve,reject){
//		console.log('submissionData ' + JSON.stringify(submissionData))
		let dataOut = {};
		// there is only one row per submission file but need to read the array[0] 
		// if more rows are added to a file this will need amending
		for (i=0; i<submissionData.length; i++) {

//		let newRow[i] = {};

	  let dateTime = submissionData[i].submission_at.substring(0, 19).replace(/[T]/g," ");
	  dataOut.timestamp = dateTime;
	  dataOut.submission_id = submissionData[i].submission_id;
	  dataOut.court = submissionData[i].court;
	  dataOut.user_type = submissionData[i].user_type;

	  if (submissionData[i].hasOwnProperty('another_reason')) {
	//      console.log('another ')
	    dataOut.another_reason = submissionData[i].another_reason;
	    }
	  else {
	    dataOut.another_reason = "";
	    }

	  if (submissionData[i].hasOwnProperty('facilities')) {
	//      console.log('facilities ')
	    dataOut.facilities = submissionData[i].facilities;
	    }
	  else {
	    dataOut.facilities = "";
	    }

	  if (submissionData.hasOwnProperty('staff'))  {
	//      console.log('staff ')
	    dataOut.staff = submissionData[i].staff;
	    }
	  else {
	    dataOut.staff = "";
	    }

	  if (submissionData.hasOwnProperty('security_and_safety')) {
	//      console.log('safety ')
	    dataOut.security_and_safety = submissionData[i].security_and_safety;
	    }
	  else {
	    dataOut.security_and_safety = "";
	    }

	  if (submissionData[i].hasOwnProperty('information_and_guidance')) {
	//      console.log('info ')
	    dataOut.information_and_guidance = submissionData[i].information_and_guidance;
	    }
	  else {
	    dataOut.information_and_guidance = "";
	    }

	  if (submissionData[i].hasOwnProperty('something_else'))  {
	//      console.log('something ')
	    dataOut.something_else = submissionData[i].something_else;
	    }
	  else {
	    dataOut.something_else = "";
	    }

	  dataOut.what_happened = submissionData.what_happened;
	  dataOut.want_reply = submissionData.want_reply;

	  if (submissionData.hasOwnProperty('email_address'))  {
	//      console.log('email_address ')
	    dataOut.email_address = submissionData.email_address;
	    }
	  else {
	    dataOut.email_address = "";
	  }

	  console.log('dataOut createRow ' + JSON.stringify(dataOut));

	}

  	resolve(dataOut)
  })

}

function writeXlsx(writeRow) {
	return new Promise(function(resolve,reject){

	  console.log('xlsxFile ' + xlsxFile);

//	  var workbook = new excelJS.Workbook();
//	  var worksheet = workbook.getWorksheet(1);
//	  workbook.xlsx.readFile(xlsxFileNameCourt)
//	  .then(function() {

		var workbook = new excelJS.Workbook();
		workbook.xlsx.readFile(xlsxFile)
		.then(function()  {
			var worksheet = workbook.getWorksheet(1);
			var lastRow = worksheet.lastRow;
			var getRowInsert = worksheet.getRow(++(lastRow.number));
			worksheet.addRow(writeXlsx);
			getRowInsert.commit();
			return workbook.xlsx.writeFile(nameFileExcel);
		})
		.catch(function(error){
			console.log(error)
		});
/*


	    worksheet.commit();

	    workbook.xlsx.writeFile(xlsxFileNameCourt)
	    .then(() => {
	      console.log("saved");
	    })
	    .catch((error) => {
	      console.log("error", error);
	    })
	  })
*/
	})
}

// Start here
// read the directory
readDirectory(directoryPath)
.then(function(allFiles) {
	console.log('files in ' + allFiles)
	// only store the .csv files
  csvFileNames = allFiles.filter(function(file) {
		return path.extname(file).toLowerCase() === pathExtensionName;
	});
  // add the full path name
	csvFilePaths = csvFileNames.map(function(filename) {
		return directoryPath + "/" + filename 
	});

	return csvFilePaths
})


// read the files
.then(function(csvFilePaths) {
	console.log('csvFilePaths ' + csvFilePaths)
	return Promise.all(
		csvFilePaths.map(function(csvFilename){
			return readFile(csvFilename)
		})
	)
})

// create the row to write
.then(function(csvData){
	return Promise.all(
		csvData.map(function(submissionData){
			return createRow(submissionData)
		})
	)
})
.then(function(dataToWrite){
	console.log('dataToWrite ' + JSON.stringify(dataToWrite))
	return Promise.all(
		dataToWrite.map(function(writeRow){
			return writeXlsx(writeRow)
		})
	)
})
.then(function(workbook) {
	
})

.catch(function(error){
	console.log(error)
});

