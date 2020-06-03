const mysql = require('mysql');

class MYSQL {
  constructor(host = 'localhost', user, password, database = '') {
    this.host = host
    this.user = user
    this.password = password
    this.database = database

    this.connection = this.connect()
  }

  connect() {
    const options = {
      host: this.host, user: this.user, password: this.password
    }

    if (this.database) {
      Object.assign(options, {
        database: this.database
      })
    }

    return mysql.createConnection(options)
  }

  exec_query(statement) {
    return new Promise((resolve, reject) => {
      this.connection.query(statement, (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      })
    })
  }

  createDatabase(dbname) {
    return new Promise((resolve, reject) => {
      this.connection.query(`CREATE DATABASE IF NOT EXISTS ${dbname}`, (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(true)
      })
    })
  }
}

module.exports = MYSQL
