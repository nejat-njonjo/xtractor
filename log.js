const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const ora = require('ora');
const spinner = ora({
  text: '🛸 Waiting for database events... 🛸',
  color: 'blue',
  spinner: 'dots2'
});

const program = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mlambe101!'
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true
  });

  await instance.start();

  instance.addTrigger({
    name: 'monitoring all statments',
    expression: 'TEST.*',
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: e => {
      console.log(e);
      spinner.succeed('👽 _EVENT_ 👽');
      spinner.start();
    }
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
  .then(spinner.start.bind(spinner))
  .catch(console.error);