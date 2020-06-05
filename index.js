const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const csv = require('./lib/csv')
const inquirer  = require('./lib/inquirer')
const MYSQL = require('./db')
const reader = require('./lib/reader')

const ora = require('ora');
const spinner = ora({
  text: '🛸 Preparing... 🛸',
  color: 'blue',
  spinner: 'dots2'
});

clear();

console.log(
  chalk.yellow(
    figlet.textSync('XTRACTOR', { horizontalLayout: 'full' })
  )
)

const program = async () => {
  try {
    const sites = await reader.readFile(`${__dirname}/json/complete.json`);

    sites.forEach(site => {      
      let { healthdata, openmrs:dbname } = site
      healthdata = `healthdata_${healthdata}`

      const db = new MYSQL('localhost', 'root', 'Mlambe101!', dbname)

      const queryStatement = `
      SELECT pii.patient_id, pii.identifier ARV_num, aa.TestOrdered as test_ordered, aa.VL as viral_load, aa.TESTDATE as vl_sample_date, aa.TimeStamp as vl_test_date FROM patient_identifier pii inner join 
      (SELECT  pi.patient_id , lp.TESTVALUE VL, ls.TimeStamp, ls.TESTDATE, lt.*
      FROM ${healthdata}.Lab_Sample ls
        left JOIN ${healthdata}.LabTestTable lt ON ls.PATIENTID = lt.Pat_ID
          left JOIN ${healthdata}.Lab_Parameter lp ON ls.Sample_ID = lp.Sample_ID
          join ${dbname}.patient_identifier pi on ls.PATIENTID = pi.identifier
      where pi.identifier_type = 3
        #WHERE lt.TestOrdered = 'Viral Load'
          #group  BY pi.patient_id
          ) as aa on pii.patient_id = aa.patient_id where pii.identifier_type = 4 GROUP BY pii.identifier, aa.TESTDATE order by pii.identifier; 
        `
      spinner.succeed(`Executing query in ${dbname} database, please wait ...`)
      spinner.start();

      db.exec_query(queryStatement).then(result => {
        spinner.succeed(`Creating ${dbname} CSV file, please wait ...`)
        spinner.start()
        csv.create(dbname, result)
        spinner.succeed('Done.')
        console.log(chalk.blue(`CSV file from ${dbname} database was successfully created!!`));
      }).catch(error => console.log(error))
    })
  } catch (error) {
    throw new Error(error)
  }
}

program()
  .then(spinner.start.bind(spinner))
  .catch(console.error);
