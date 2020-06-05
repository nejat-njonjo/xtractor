const MYSQL = require('./db')
const { sourceDirectory } = require('./config')
const chalk = require('chalk')
const reader = require('./lib/reader')
const childProcess = require("child_process")
const db = new MYSQL('localhost', 'root', 'Mlambe101!')

const CLUI = require('clui')
const Spiner = CLUI.Spinner;

const fileExtention = filename => filename.toLowerCase().split('.').pop()

const extractDatabaseName = filename => {
  const segments = filename.toLowerCase().split('_')
  let dbname = `${segments[0]}_${segments[1]}`

  if (segments[1] === 'st') {
    dbname = dbname.replace('_', '_st_')
  }

  if (dbname.includes('.')) {
    dbname = dbname.split('.')[0]
  }

  return dbname;
}

const spinner = new Spiner('Dumping sites, this might take longer...');

const dumpSQLData = (database, source) => {
  return new Promise((resolve, reject) => {
    try {
      spinner.start()
      childProcess.exec(`mysql -u root -pMlambe101! ${database} < ${source}`, (error, stdout, stderror) => {
        spinner.stop()
        if (error) {
          reject(error)
          return
        }
        resolve(true)
      })
    } catch (error) {
      reject(error)
    }
  })
}

const runSetup = async () => {
  try {
    const files = await reader.listFiles(sourceDirectory)

    if (files) {
      spinner.start();
      files.forEach(filename => {
        const dbname = extractDatabaseName(filename)
        const filePath = `${sourceDirectory}/${filename}`

        db.createDatabase(dbname).then(created => {
          if (created) {
            spinner.stop();

            dumpSQLData(dbname, filePath).then(dumped => {
              if (dumped) {
                console.log(
                  chalk.blue(`Imported ${filename} into ${dbname} database`)
                )
                spinner.stop()
              }
            }).catch(err => spinner.stop())
          }
        }).catch(err => spinner.stop())
      })
    }
  } catch (error) {
    spinner.stop()
    throw new Error(error)
  }
}

runSetup()
