const MYSQL = require('./db')
const db = new MYSQL('localhost', 'root', 'Mlambe101!')
const fs = require('fs')

const execute = async () => {
  try {
    const databases = await db.exec_query('SHOW DATABASES');
    const healthdatas = []
    const opernmrs = []
    const completeSites = []
    const known = []
    const unknown = []
    
    databases.forEach(raw => {
      const dbname = raw.Database
      if (dbname.startsWith('healthdata_')) {
        healthdatas.push(dbname)
      } else if (dbname.startsWith('openmrs_')) {
        opernmrs.push(dbname)
      }
    });


    healthdatas.forEach(site => {
      const healthSite = site.split('_')[1]
      const possibleMatch = opernmrs.filter(opn => opn.split('_')[1] === healthSite)
      
      if (possibleMatch.length > 0) {
        known.push(possibleMatch[0])
        known.push(healthSite)
        completeSites.push({
          openmrs: possibleMatch[0],
          healthdata: healthSite
        })
      }
    })   


    opernmrs.forEach(opn => {
      if (!known.includes(opn)) {
        unknown.push(opn)
      }
    })

    healthdatas.forEach(opn => {
      if (!known.includes(opn.split('_')[1])) {
        unknown.push(opn)
      }
    })

    fs.writeFileSync(`${__dirname}/json/unknown.json`, JSON.stringify(unknown), (err) => { 
      if (err) console.log(err) 
    })

    fs.writeFileSync(`${__dirname}/json/complete.json`, JSON.stringify(completeSites), (err) => { 
      if (err) console.log(err) 
    })

    console.log(completeSites.length);

    process.exit()
  } catch (error) {
    throw new Error(error)
  }
}

execute()