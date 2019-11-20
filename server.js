//---DEPENDENCIES---//

const inquirer = require("inquirer");
const mysql = require("mysql");

//---CONNECTION---//

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_db"
})

connection.connect(function (err) {
    if (err) throw err;

    console.log("connected as id " + connection.threadId + "\n");

    initialQuestion();
})

//---VARIABLES---//

const Q_Initial = {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [{ name: "Add", value: "add" }, { name: "View", value: "view" }, { name: "Update a role", value: "update" }]
}

const Q_Add = {
    type: "list",
    name: "dataType",
    message: "What would you like to add?",
    choices: [{ name: "Department", value: "department" }, { name: "Role", value: "role" }, { name: "Employee", value: "employee" }]
}

const Q_AddDepartment = {
    type: "input",
    name: "departmentName",
    message: "What department would you like to add?"
}

const Q_AddRole = [{
    type: "input",
    name: "roleTitle",
    message: "What role would you like to add?"
},
{
    type: "number",
    name: "department_id",
    message: "What is the ID of the department for this role?"
}]

const Q_AddEmployee = [{
    type: "input",
    name: "first_name",
    message: "What is their first name?"
},
{
    type: "input",
    name: "last_name",
    message: "What is their last name?"
},
{
    type: "number",
    name: "role_id",
    message: "What is the ID of their role?"
},
{
    type: "number",
    name: "manager_id",
    message: "What is the ID of their manager? (-1 if they have no manager)"
}]

const Q_View = {
    type: "list",
    name: "dataType",
    message: "What would you like to view?",
    choices: [{ name: "Departments", value: "department" }, { name: "Roles", value: "role" }, { name: "Employees", value: "employee" }]
}

//---FUNCTIONS---//

function initialQuestion() {
    inquirer.prompt(Q_Initial).then(answer => {

        console.log(answer);

        switch (answer.action) {
            case ("add"):
                addQuestions();
                break;
            case ("view"):
                viewQuestion();
                break;
            case ("update"):
                updateQuestion();
                break;
            default:
                console.error("Uncaught case for initialQuestion()");
                break;
        }

    })
}

//---CREATE---//

function addQuestions() {
    inquirer.prompt(Q_Add).then(addInfo => {

        const dataInfo = { dataType: addInfo.dataType };        //I want to create a function which takes in any of the switch statement data to create a new data point.  But I don't know how.  I also suck as explaining this..... Hopefully I remember what I mean.

        switch (addInfo.dataType) {
            case ("department"):
                inquirer.prompt(Q_AddDepartment).then(departmentInfo => {
                    console.log(departmentInfo);
                    console.log("^^^ Add department info");

                    connection.query("INSERT INTO department(departmentName) VALUES (?)", [departmentInfo.departmentName], (error, response) => {
                        if (error) throw error;

                        console.log("Inserted new department info");

                        initialQuestion();
                    });
                });
                break;
            case ("role"):
                inquirer.prompt(Q_AddRole).then(roleInfo => {
                    console.log(roleInfo);
                    console.log("^^^ Add role info");

                    connection.query("INSERT INTO role(roleTitle, department_id) VALUES (?, ?)", [roleInfo.roleTitle, roleInfo.department_id], (error, response) => {
                        if (error) throw error;

                        console.log("Inserted new role info");

                        initialQuestion();
                    });
                });
                break;
            case ("employee"):
                inquirer.prompt(Q_AddEmployee).then(employeeInfo => {
                    console.log(employeeInfo);
                    console.log("^^^ Add employee info");
                    dataInfo.data = employeeInfo;

                    if (employeeInfo.manager_id > 0) {
                        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [employeeInfo.first_name, employeeInfo.last_name, employeeInfo.role_id, employeeInfo.manager_id], (error, response) => {
                            if (error) throw error;

                            console.log("Inserted new role info");

                            initialQuestion();
                        });
                    }
                    else {
                        connection.query("INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?)", [employeeInfo.first_name, employeeInfo.last_name, employeeInfo.role_id], (error, response) => {
                            if (error) throw error;

                            console.log("Inserted new role info");


                            initialQuestion();
                        });
                    }
                });
                break;
            default:
                console.error("Uncaught case on addQuestions()... addInfo.dataType : " + addInfo.dataType);
        }
        //Switch for answer.dataType
        //Inquirer input for each case to get information about the new data.

    })
}

//---RETRIEVE---//

function viewQuestion() {
    inquirer.prompt(Q_View).then(answer => {

        view(answer.dataType);

        switch(answer.dataType)
        {
            case("department"):
            connection.query("SELECT * FROM department", (err, res) => {
                if(err) throw err;

                console.table(res);

                initialQuestion();
            });
            break;
            case("role"):
            connection.query("SELECT * FROM role", (err, res) => {
                if(err) throw err;

                console.table(res);
                
                initialQuestion();
            });
            break;
            case("employee"):
            connection.query("SELECT * FROM employee", (err, res) => {
                if(err) throw err;

                console.table(res);
                
                initialQuestion();
            });
            break;
            default:
                console.error("Uncaught case in viewQuestion()");
                break;
        }

    })
}

//---UPDATE---//

function updateQuestion() {

    //Inquirer questions to get : which role to update AND information to update

    inquirer.prompt(Q_UpdateRole)

    //...Then, send parameters to 'update()'

}