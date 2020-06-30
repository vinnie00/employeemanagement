var mysql = require("mysql");
var { prompt } = require("inquirer");
const { exit, allowedNodeEnvironmentFlags } = require("process");
const db = require("./db");
const { async } = require("rxjs/internal/scheduler/async");
const {
  removeEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  addRole,
} = require("./db");

runSearch();

function runSearch() {
  prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "view all employees",
      "view employees by department",
      "view all employees by manager",
      "view departments",
      "view roles",
      "add employee",
      "add department",
      "add role",
      "remove employee",
      "update employee role",
      "update employee manager",
      "exit",
    ],
  }).then(function (answer) {
    switch (answer.action) {
      case "add employee":
        addEmployee();
        break;
      case "add department":
        addDepartment();
        break;
      case "add role":
        addRoleInfo();
        break;
      case "remove employee":
        removeEmployeeRecord();
        break;
      case "update employee role":
        updateEmployeeRoleRecord();
        break;
      case "update employee manager":
        updateEmployeeManagerRecord();
        break;
      case "view employees by department":
        viewEmployeesByDepartment();
        break;
      case "view all employees by manager":
        viewEmployeesByManager();
        break;
      case "view departments":
        viewDepartments();
        break;
      case "view all employees":
        viewEmployees();
        break;
      case "view roles":
        viewRoles();
        break;
      case "exit":
        exit();
        break;
    }
  });
}
async function viewEmployees() {
  const employee = await db.findEmployees();
  console.log("\n");
  console.table(employee);
  runSearch();
}

async function viewEmployeesByDepartment() {
  const departments = await db.findAllDepartments();
  let departmentValues = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see Id's for?",
      choices: departmentValues,
    },
  ]);
  const employeeInDepartment = await db.findEmployeesByDepartment(departmentId);
  console.log("\n");
  console.table(employeeInDepartment);
  runSearch();
}
async function viewEmployeesByManager() {
  const employees = await db.findEmployees();
  const employeeChoices = employees.map(({ id, last_name }) => ({
    name: last_name,
    value: id,
  }));
  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager would you like to see the employees for?",
      choices: employeeChoices,
    },
  ]);
  const employeeUnderManager = await db.findEmployeesByManager(managerId);
  console.log("\n");
  console.table(employeeUnderManager);
  runSearch();
}
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findEmployees();
  const employeeInfo = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);
  const roleChoises = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: roleChoises,
    },
  ]);
  const managerChoices = employees.map(({ id, last_name }) => ({
    name: last_name,
    value: id,
  }));
  managerChoices.unshift({ name: "None", value: null });
  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employees manager?",
    choices: managerChoices,
  });
  employeeInfo.role_id = roleId;
  employeeInfo.manager_id = managerId;
  await db.addEmployee(employeeInfo);
  console.log("Employee added!");
  runSearch();
}
async function addDepartment() {
  prompt({
    name: "department",
    type: "input",
    message: "What is the name of the new department?",
  }).then(function (answer) {
    var query = "INSERT INTO department (name) VALUES ( ? )";
    connection.query(query, answer.department, function (err, res) {
      console.log("Department Added!");
    });
    runSearch();
  });
}
async function addRoleInfo() {
  const roles = await db.findAllRoles();
  const department = await db.findAllDepartments();
  console.table(roles)
  const departmentChoices = department.map(({ id, name}) => ({
    name: name,
    value: id
  }));
  const roleInfo = await prompt([
    {
      name: "title",
      message: "What is the new role?"
    },
    {
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "What department does the role belong to?",
      choices: departmentChoices
    }
  ]);

  await db.addRole(roleInfo);

  console.log("role added")

  runSearch();

}
async function removeEmployeeRecord() {
  const employees = await db.findEmployees();
  const employeeChoices = employee.map(({ id, last_name }) => ({
    name: last_name,
    value: id,
  }));
  const whichEmployee = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which Employee whould you like to remove?",
      choices: employeeChoices,
    },
  ]);
  await db.removeEmployee(whichEmployee);
  console.log("Employee removed");
  runSearch();
}
async function updateEmployeeRoleRecord() {
  const employees = await db.findEmployees();
  const roles = await db.findAllRoles();
  const employeeChoices = employees.map(({ id, last_name }) => ({
    name: last_name,
    value: id,
  }));
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which Employee whould you like to update?",
      choices: employeeChoices,
    },
  ]);
  const roleChoises = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's new role?",
      choices: roleChoises,
    },
  ]);

  await db.updateEmployeeRole(employeeId, roleId);
  console.log("Updated employee!");
  runSearch();
}
async function updateEmployeeManagerRecord() {
  const employees = await db.findEmployees();
  const employeeChoices = employees.map(({ id, last_name }) => ({
    name: last_name,
    value: id,
  }));
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which Employee whould you like to update?",
      choices: employeeChoices,
    },
  ]);
  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Who is the new manager",
      choices: employeeChoices,
    },
  ]);
  await db.updateEmployeeManager(employeeId, managerId);
  console.log("Updated employee's manager!");
  runSearch();
}
async function viewRoles() {
  const roles = await db.findAllRoles();
  console.log("\n");
  console.table(roles);
  runSearch();
}
async function viewDepartments() {
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  runSearch();
}

// first, last, role, manager
