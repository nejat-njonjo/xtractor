const csvjson = require('csvjson');
const fs = require('fs');
const outDir = '/home/dataframe/Desktop/Extractions'

const create = (dbname, content) => {
  const path = `${outDir}/${dbname}.csv`
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
