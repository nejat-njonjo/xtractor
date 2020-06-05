const fs = require('fs')

const listFiles = (path = '') => {
  return new Promise((resolve, reject) => {
    try {
      path = path ? path : __dirname
      fs.readdir(path, (error, files) => {
        if (error) {
          reject(error)
          return
        }

        resolve(files)
      })
    } catch (error) {
      reject(error)
    }
  })
}

const readFile = path => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, (error, data) => {
        if (error) {
          reject(error)
          return
        }
        const ext = path.split('.').pop()
        
        if (ext === 'json') {
          resolve(JSON.parse(data))
          return
        } 

        resolve(data)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  listFiles,
  readFile
}