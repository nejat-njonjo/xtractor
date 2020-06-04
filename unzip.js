const config = require('./config')
const childProcess = require("child_process")
const reader = require('./lib/reader')

const fileExtention = filename => filename.toLowerCase().split('.').pop()

const execute = async () => {
  try {
    const files = await reader.listFiles(config.sourceDirectory)

    files.forEach(filename => {
      if (fileExtention(filename) === 'gz') {
        unzip(`${config.sourceDirectory}/${filename}`)
      }
    });
  } catch (error) {
    console.log(error)
  }
}

const unzip = file => {
  childProcess.exec(`gunzip ${file}`, (error, stdout, stderror) => {
    if (error) {
      console.log(error)
      return
    }
  
    console.log(`unzipped ${file}`)
  })
}

execute();
