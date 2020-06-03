const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const csv = require('./lib/csv')
const inquirer  = require('./lib/inquirer')
const MYSQL = require('./db')

const CLUI = require('clui')
const Spiner = CLUI.Spinner;

clear();

console.log(
  chalk.yellow(
    figlet.textSync('CHAI', { horizontalLayout: 'full' })
  )
)

const run = async () => {
  try {
    let {dbname, healthdata} = await inquirer.askMysqlCredentials()
    const db = new MYSQL('localhost', 'root', 'Mlambe101!', dbname)

    healthdata = `healthdata_${healthdata}`

    const queryStatement = `
      SELECT pii.patient_id, pii.identifier ARV_num, aa.TestOrdered, aa.VL as Viral_Load, aa.TESTDATE, aa.OrderDate FROM patient_identifier pii inner join 
      (SELECT  pi.patient_id , lp.TESTVALUE VL,ls.TESTDATE, lt.*
      FROM ${healthdata}.Lab_Sample ls
        left JOIN ${healthdata}.LabTestTable lt ON ls.PATIENTID = lt.Pat_ID
          left JOIN ${healthdata}.Lab_Parameter lp ON ls.Sample_ID = lp.Sample_ID
          join ${dbname}.patient_identifier pi on ls.PATIENTID = pi.identifier
      where pi.identifier_type = 3
        #WHERE lt.TestOrdered = 'Viral Load'
          #group  BY pi.patient_id
          ) as aa on pii.patient_id = aa.patient_id where pii.identifier_type = 4 GROUP BY pii.identifier, aa.TESTDATE, aa.OrderDate order by pii.identifier; 
      `

    const queryStatus = new Spiner(`Executing query in ${dbname} database, please wait ...`)
    queryStatus.start();
    const result = await db.exec_query(queryStatement)
    queryStatus.stop();

    const csvStatus = new Spiner(`Creating ${dbname} CSV file, please wait ...`)
    csvStatus.start();
    csv.create(dbname, result)
    csvStatus.stop();

    console.log(chalk.blue(`CSV file from ${dbname} database was successfully created!!`));

    process.exit();
  } catch (error) {
    console.log(error)
  }
}

run();
