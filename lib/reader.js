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

module.exports = {
  listFiles
}