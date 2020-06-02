const mysql = require('mysql');

class MYSQL {
  constructor(host = 'localhost', user, password, database) {
    this.host = host
    this.user = user
    this.password = password
    this.database = database

    this.connection = this.connect()
  }

  connect() {
    return mysql.createConnection({
      host: this.host, user: this.user, password: this.password, database: this.database
    })
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
}

module.exports = MYSQL
