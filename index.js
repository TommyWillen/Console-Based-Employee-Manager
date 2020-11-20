const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();


const connection = mysql.createConnection({
    host: "localhost",

    // Port is defined in .env file
    port: process.env.DB_PORT,

    // Your username (defined in .env file)
    user: process.env.DB_USER,

    // Your password (defined in .env file)
    password: process.env.DB_PASSWORD,
    // You will need to create the db and add it here or in a .env file
    database: process.env.DB_DB
});

connection.connect(function (err) {
    if (err) throw err;
    runEmployeeEdit();
});
// first question to be called in the run employee edit function
const readyQuestion = {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
        { name: "View all employees", value: "viewAll" },
        { name: "View employees by department", value: "viewDepot" },
        { name: "View employees by manager", value: "viewManager" },
        { name: "View employees by employee role", value: "viewRole" },
        { name: "Add employee", value: "addEmp" },
        { name: "Update employee role", value: "empRole" },
        { name: "Update employee manager", value: "empMan" },
        { name: "Remove employee", value: "removeEmp" },
        { name: "View all roles", value: "role" },
        { name: "Add new role", value: "addRole" },
        { name: "Remove role", value: "removeRole" },
        { name: "View all departments", value: "depots" },
        { name: "Add department", value: "addDepot" },
        { name: "Remove department", value: "removeDepot" },
        { name: "View department budget", value: "budget" },
        { name: "Exit application", value: "exit" }
    ],
    loop: true,
}

const runEmployeeEdit = () => {
    inquirer
        .prompt(readyQuestion).then(response => {
            switch (response.action) {
                case "viewAll": viewAllFunc();
                    break;
                case "viewDepot": viewDepotFunc();
                    break;
                case "viewManager": viewManagerFunc();
                    break;
                case "viewRole": viewRoleFunc();
                    break;
                case "addEmp": addEmpFunc();
                    break;
                case "empRole": empRoleFunc();
                    break;
                case "empMan": empManFunc();
                    break;
                case "removeEmp": removeEmpFunc();
                    break;
                case "role": roleFunc();
                    break;
                case "addRole": addRoleFunc();
                    break;
                case "removeRole": removeRoleFunc();
                    break;
                case "depots": depotsFunc();
                    break;
                case "addDepot": addDepotFunc();
                    break;
                case "removeDepot": removeDepotFunc();
                    break;
                case "budget": budgetFunc();
                    break;
                case "exit": connection.end();
            }
        })
}

const viewAllFunc = () => {

    runEmployeeEdit();
};

const viewDepotFunc = () => {

    runEmployeeEdit();

};

const viewManagerFunc = () => {

    runEmployeeEdit();

};

const viewRoleFunc = () => {

    runEmployeeEdit();

};

const addEmpFunc = () => {

    runEmployeeEdit();

};

const empRoleFunc = () => {

    runEmployeeEdit();

};

const empManFunc = () => {

    runEmployeeEdit();

};

const removeEmpFunc = () => {

    runEmployeeEdit();

};

const roleFunc = () => {

    runEmployeeEdit();

};

const addRoleFunc = () => {

    runEmployeeEdit();

};
const removeRoleFunc = () => {

    runEmployeeEdit();

};
const depotsFunc = () => {

    runEmployeeEdit();

};
const addDepotFunc = () => {

    runEmployeeEdit();

};
const removeDepotFunc = () => {

    runEmployeeEdit();

};
const budget01Func = () => {

    runEmployeeEdit();

};