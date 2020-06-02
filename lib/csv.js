const csvjson = require('csvjson');
const fs = require('fs'); 

const create = (dbname, content) => {
  const path = `${__dirname}/data/${dbname}.csv`
  const data = csvjson.toCSV(content, {
    delimiter: ',',
    wrap : false,
    headers: 'key'
  })

  fs.writeFileSync(path, data, { encoding : 'utf8'}, (err) => { 
    if (err) console.log(err); 
  }); 
}

module.exports = {
  create
}
