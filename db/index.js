const connection = require("./connection")
class DB {
    constructor(connection){
        this.connection = connection
    }
    findEmployees() {
        return this.connection.query(
            "select employee.id, employee.first_name, employee.last_name, role.title, manager.first_name from employee left join role on employee.role_id = role.id left join employee manager on employee.manager_id = manager.id"
        )
    }
    // findEmployeesByManager(managerId) {
    //     return this.connection.query("select employee.id, employee.first_name, employee.last_name, role.title, manager.first_name from employee left join role on employee.role_id = role.id left join employee manager on employee.manager_id = manager.id where manager_id = ?", managerId)
    // }
    findEmployeesByManager(managerId) {
    return this.connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
        managerId
      );
    }
    findEmployeesByDepartment(departmentId) {
        return this.connection.query("select employee.id, employee.first_name, employee.last_name, role.title from employee left join role on employee.role_id = role.id left join department department on role.department_id = department.id where department_id = ?", departmentId)
    }
    addEmployee(employee) {
        return this.connection.query(
            "insert emplointo employee where id = set ?", 
            employee
        )
    }
    
        removeEmployee(employeeId) {
            return this.connection.query(
              "DELETE FROM employee WHERE id = ?",
              employeeId
            );
        }

    updateEmployeeRole(employeeId, roleId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        );
        }
    updateEmployeeManager(id,manager_id) {
        return this.connection.query(
            "update employee set manager_id = ? where id = ?", [manager_id, id]
        )
    }
    findAllDepartments() {
        return this.connection.query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        )
    }
    findAllRoles() {
        return this.connection.query(
          "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
      }
    addRole(role) {
        return this.connection.query(
            "insert into role set ?", 
            role
        )
    }
}
module.exports = new DB(connection)
