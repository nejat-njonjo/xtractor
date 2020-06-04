const MYSQL = require('./db')
const { sourceDirectory } = require('./config')
const reader = require('./lib/reader')
const childProcess = require("child_process")
const db = new MYSQL('localhost', 'root', 'Mlambe101!')

const CLUI = require('clui')
const Spiner = CLUI.Spinner;

let spinner = new Spiner('');

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

const dumpSQLData = (database, source) => {
  return new Promise((resolve, reject) => {
    try {
      childProcess.exec(`pv ${source} | mysql -u root -pMlambe101! ${database}`, (error, stdout, stderror) => {
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
      files.forEach(filename => {
        const ext = fileExtention(filename)
        const dbname = extractDatabaseName(filename)
        const filePath = `${sourceDirectory}/${filename}`

        const created = db.createDatabase(dbname);

        if (created) {
          spinner = new Spiner(`Dumping data into ${dbname} from ${filePath}...`);
          spinner.start();
          const dump = await dumpSQLData(dbname, filePath);

          if (dump) {
            spinner.stop()
          }
        }
      })
    }
  } catch (error) {
    throw new Error(error)
  }
}

runSetup()
