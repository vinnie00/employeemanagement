const { strictEqual } = require("assert")

const util = require("util")
const mysql = require("mysql")

const connection = mysql.createConnection({
    port: 3306,
    user: "root",
    password: "codingbootcamp",
    database: "employee_managementDB"
})

connection.connect()
connection.query = util.promisify(connection.query) 
module.exports = connection