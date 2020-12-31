const rp = require('request-promise');
const $ = require('cheerio');
const courtParse = function(url) { 
  console.log('url courtParse ' + url)
  let options = {
    uri:url,
    simple: false,
  }
return new Promise((resolve, reject) => {
  fs.readdir( directoryPath, function( error, files) {
    if ( error ) {
        return console.log("Error reading directory contents.");
    };

    resolve(files)

    });
  });
};
  return rp(url)
    .then(function(html) {
      const courtNameEdit = $('header.page-header', html).text().replace(/[\n\r]/g, '').trim();
      const additionalInfoEdit = $("h2:contains('Additional Information')", html).parent().text().replace(/[\n\r]/g, '').trim();
      return {
        courtName: courtNameEdit,
        additionalInfo: additionalInfoEdit,
       };
    })
    .catch(function(err) {
      console.log('courtParse error ' + err)
    });

};

module.exports = courtParse;