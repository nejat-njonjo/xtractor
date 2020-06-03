const fs = require('fs');
const MYSQL = require('./db');
const childProcess = require("child_process");
const db = new MYSQL('localhost', 'root', 'Mlambe101!')

const readFiles = (directory = '') => {
  return new Promise((resolve, reject) => {
    let path = directory ? directory : __dirname

    fs.readdir(path, function(error, filenames) {
      if (error) {
        reject(error)
        return
      }

      resolve(filenames)
    });
  })
}

const normalizeSite = filename => {
  if (filename.startsWith('healthdata_')) {
    const segments = filename.split('_')
    let site = `healthdata_${segments[1]}`

    if (segments.includes('st')) {
      site = `${site}_${segments[2]}`
    }

    if (site.includes('.')) {
      site = site.split('.')[0]
    }

    if (site.includes('-')) {
      site = site.split('-')[0]
    }

    return site
  }
}

const searchDir = '/home/dataframe/Desktop/CHAI/Deliwe'

readFiles(searchDir).then(filenames => {
  filenames.forEach(filename => {
    const filePath = `${searchDir}/${filename}`

    if (filename.startsWith('healthdata')) {
      const site = normalizeSite(filename)
      if (site) {
        setupHealthData(filePath, normalizeSite(filename)).then(unzipped => {
          console.log(unzipped)
        }).catch(error => console.log(error))
      }
    }
  });
}).catch(error => {
  throw new Error(error).message
})

const setupHealthData = (path, database) => {
  return new Promise((resolve, reject) => {
    db.createDatabase(database).then(created => {
      if (created) {
        childProcess.exec(`mysql -u root -pMlambe101! ${database} < ${path}`, function (error, stdout, stderr) {
          if (error) {
            reject(error);
            return
          }

          resolve({stdout, stderr})
        });
      }
    }).catch(error => {
      console.log(error)
    })
  })
}