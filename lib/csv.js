const csvjson = require('csvjson')
const fs = require('fs')
const moment = require('moment')
const outDir =  '/home/dataframe/Desktop/ChaiExports'

const cleanContent = payload => {
  try {
    const cleanedContent = []
    const contentSize = payload.length
  
    for (let i = 0; i < contentSize; i++) {
      const vl_date = payload[i].vl_test_date
      Object.assign(payload[i], {
        vl_test_date: moment(vl_date).format('YYYY-MM-DD HH:mm')
      })
  
      cleanedContent.push(payload[i])
    }
  
    return cleanedContent;
  } catch (error) {
    throw new Error(error)
  }
}

const create = (dbname, content) => {
  try {
    const path = `${outDir}/${dbname}.csv`
    const csvData = cleanContent(content)

    const data = csvjson.toCSV(csvData, {
      delimiter: ',',
      wrap : false,
      headers: 'key'
    })

    fs.writeFileSync(path, data, { encoding : 'utf8'}, (err) => { 
      if (err) console.log(err) 
    })  
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  create
}
