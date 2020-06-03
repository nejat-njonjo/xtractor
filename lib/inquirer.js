const inquirer = require('inquirer');

module.exports = {
  askMysqlCredentials: () => {
    const questions = [
      {
        name: 'healthdata',
        type: 'input',
        message: 'Enter mysql healthdata database',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter correct healthdata database';
          }
        }
      },
      {
        name: 'dbname',
        type: 'input',
        message: 'Enter mysql database:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter correct mysql database';
          }
        }
      }
      // {
      //   name: 'user',
      //   type: 'input',
      //   message: 'Enter mysql user:',
      //   validate: function( value ) {
      //     if (value.length) {
      //       return true;
      //     } else {
      //       return 'Please enter correct mysql user';
      //     }
      //   }
      // }
      // {
      //   name: 'password',
      //   type: 'password',
      //   message: 'Enter mysql password:',
      //   validate: function(value) {
      //     if (value.length) {
      //       return true;
      //     } else {
      //       return 'Please enter correct mysql password.';
      //     }
      //   }
      // }
    ];
    return inquirer.prompt(questions);
  },
};