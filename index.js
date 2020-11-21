const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();
const text = require("./ignore/text")

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
  // text();
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
// finished
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
// finished
const viewAllFunc = () => {
  const query = `SELECT e.id AS ID, 
  concat(e.first_name, " ", e.last_name) AS name, 
  title AS title,
  salary, 
  department_name AS department, 
  concat(m.first_name, " ", m.last_name) AS manager
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  JOIN department ON employee_role.department_id = department.id
  LEFT JOIN employee m ON e.manager_id = m.id`;

  connection.query(query, function (err, res) {
    console.log("\n" + res.length + " employees found! \n");
    let empArr = []
    for (let i = 0; i < res.length; i++) {
      let empObj = { Id: res[i].ID, Name: res[i].name, Title: res[i].title, Salary: res[i].salary, Department: res[i].department, Manager: res[i].manager }
      empArr.push(empObj);
    }
    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// finished
const viewDepotFunc = () => {
  connection.query("Select department.department_name FROM department", function (err, res) {
    let depotChoice = [];
    for (let i = 0; i < res.length; i++) {
      depotChoice.push(res[i].department_name);
    }
    inquirer.prompt({
      name: "empDepotSearch",
      type: "list",
      message: "Which department would you like to view the employees for?",
      choices: depotChoice
    }).then(response => {
      let query = `SELECT e.id AS ID, 
      concat(e.first_name, " ", e.last_name) AS name, 
      title AS title,
      salary, 
      department_name AS department, 
      concat(m.first_name, " ", m.last_name) AS manager
      FROM employee e
      JOIN employee_role ON e.role_id = employee_role.id
      JOIN department ON employee_role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
      where department.department_name = ?`
      connection.query(query, [response.empDepotSearch], function (err, res) {
        console.log("\n" + res.length + " employees found! \n");
        let empArr = []
        for (let i = 0; i < res.length; i++) {
          let empObj = { Id: res[i].ID, Name: res[i].name, Title: res[i].title, Salary: res[i].salary, Department: res[i].department, Manager: res[i].manager }
          empArr.push(empObj);
        }
        console.table(empArr);
        console.log("\n")
        runEmployeeEdit();
      })
    })
  })


};
// finished
const viewManagerFunc = () => {
  connection.query(`SELECT e.ID, concat(e.first_name, " ", e.last_name) AS name
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  WHERE employee_role.is_manager = true`,
    function (err, res) {
      let mangChoice = [];
      for (let i = 0; i < res.length; i++) {
        mangChoice.push(res[i]);
      }
      inquirer.prompt({
        name: "empMangSearch",
        type: "list",
        message: "Which manager would you like to view the employees for?",
        choices: mangChoice
      }).then(response => {
        let query = `SELECT e.id AS ID, 
      concat(e.first_name, " ", e.last_name) AS name, 
      title AS title,
      salary, 
      department_name AS department, 
      concat(m.first_name, " ", m.last_name) AS manager
      FROM employee e
      JOIN employee_role ON e.role_id = employee_role.id
      JOIN department ON employee_role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
      where m.ID = ?`
        let realMang = mangChoice.filter(mang => mang.name === response.empMangSearch);
        connection.query(query, realMang[0].ID, function (err, res) {
          console.log("\n" + res.length + " employees found! \n");
          let empArr = []
          for (let i = 0; i < res.length; i++) {
            let empObj = { Id: res[i].ID, Name: res[i].name, Title: res[i].title, Salary: res[i].salary, Department: res[i].department, Manager: res[i].manager }
            empArr.push(empObj);
          }
          console.table(empArr);
          console.log("\n")
          runEmployeeEdit();
        })
      })
    })

};
// finished
const viewRoleFunc = () => {

  connection.query("Select employee_role.title FROM employee_role", function (err, res) {
    let roleChoice = [];
    for (let i = 0; i < res.length; i++) {
      roleChoice.push(res[i].title);
    }
    inquirer.prompt({
      name: "empRoleSearch",
      type: "list",
      message: "Which role would you like to view the employees for?",
      choices: roleChoice
    }).then(response => {
      let query = `SELECT e.id AS ID, 
      concat(e.first_name, " ", e.last_name) AS name, 
      title AS title,
      salary, 
      department_name AS department, 
      concat(m.first_name, " ", m.last_name) AS manager
      FROM employee e
      JOIN employee_role ON e.role_id = employee_role.id
      JOIN department ON employee_role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
      where employee_role.title = ?`
      connection.query(query, [response.empRoleSearch], function (err, res) {
        console.log("\n" + res.length + " employees found! \n");
        let empArr = []
        for (let i = 0; i < res.length; i++) {
          let empObj = { Id: res[i].ID, Name: res[i].name, Title: res[i].title, Salary: res[i].salary, Department: res[i].department, Manager: res[i].manager }
          empArr.push(empObj);
        }
        console.table(empArr);
        console.log("\n")
        runEmployeeEdit();
      })
    })
  })

};
// finished
const addEmpFunc = () => {
  let query = `SELECT e.id AS ID, 
  concat(e.first_name, " ", e.last_name) AS name,
  employee_role.id AS role_id,
  title,
  salary, 
  department_name AS department,
  is_manager,
  concat(m.first_name, " ", m.last_name) AS manager
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  JOIN department ON employee_role.department_id = department.id
  LEFT JOIN employee m ON e.manager_id = m.id`

  connection.query(query, function (err, res) {
    let depotChoice = [];
    for (let i = 0; i < res.length; i++) {
      (depotChoice.includes(res[i].department)) ? false : depotChoice.push(res[i].department);
    }
    inquirer.prompt([{
      name: "addFirstName",
      type: "input",
      message: "What is the employee's first name?",
    },
    {
      name: "addLastName",
      type: "input",
      message: "What is the employee's last name?",
    },
    {
      name: "depotChoice",
      type: "list",
      message: "What department is the employee's joining?",
      choices: depotChoice,
    }]).then(ans => {
      let managerList = [];
      let roleList = [];
      for (let i = 0; i < res.length; i++) {
        (res[i].is_manager && res[i].department === ans.depotChoice) ? managerList.push(res[i].name) : false
      }
      for (let i = 0; i < res.length; i++) {
        (!roleList.includes(res[i].title) && res[i].department === ans.depotChoice) ? roleList.push(res[i].title) : false
      }
      inquirer.prompt(
        {
          name: "roleChoice",
          type: "list",
          message: "What position will this employee fulfill?",
          choices: roleList,
        }).then(answer => {
          let roleMang = res.filter(role => role.title === answer.roleChoice);
          if (!roleMang[0].is_manager) {
            inquirer.prompt(
              {
                name: "managerChoice",
                type: "list",
                message: "Who is the employee's manager?",
                choices: managerList,
              }
            ).then(response => {
              let titleChoice = res.filter(title => title.title === answer.roleChoice);
              let mangChoice = res.filter(mang => mang.name === response.managerChoice);
              let query2 = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`
              connection.query(query2, [ans.addFirstName, ans.addLastName, titleChoice[0].role_id, mangChoice[0].ID], function (err, res2) {
                console.log("Employee added! \n")
                runEmployeeEdit();
              })

            })
          } else {
            let titleChoice = res.filter(title => title.title === answer.roleChoice);
            let query2 = `INSERT INTO employee (first_name, last_name, role_id)
        VALUES (?, ?, ?)`
            connection.query(query2, [ans.addFirstName, ans.addLastName, titleChoice[0].role_id], function (err, res2) {
              console.log("Manager added! \n")
              runEmployeeEdit();
            })
          }
        })


    })

  })


};
// update func
const empRoleFunc = () => {

  runEmployeeEdit();

};
// update func
const empManFunc = () => {

  runEmployeeEdit();

};
// remove func
const removeEmpFunc = () => {

  runEmployeeEdit();

};
// finished
const roleFunc = () => {
  const query = `SELECT r.id as ID, r.title, r.salary, department_name
  FROM employee_role r
  JOIN department ON r.department_id = department.id`;

  connection.query(query, function (err, res) {
    console.log("\n" + res.length + " roles found! \n");
    let empArr = []
    for (let i = 0; i < res.length; i++) {
      let empObj = { Id: res[i].ID, Title: res[i].title, Salary: res[i].salary, Department: res[i].department_name }
      empArr.push(empObj);
    }
    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// add func
const addRoleFunc = () => {

  runEmployeeEdit();

};
// remove func
const removeRoleFunc = () => {

  runEmployeeEdit();

};
// finished
const depotsFunc = () => {
  const query = `SELECT * FROM department`;

  connection.query(query, function (err, res) {
    console.log("\n" + res.length + " departments found! \n");
    let empArr = []
    for (let i = 0; i < res.length; i++) {
      let empObj = { Id: res[i].id, Department: res[i].department_name }
      empArr.push(empObj);
    }
    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// add func
const addDepotFunc = () => {

  runEmployeeEdit();

};
// revomve func
const removeDepotFunc = () => {

  runEmployeeEdit();

};
// weird view func
const budgetFunc = () => {
  const query = `SELECT salary, 
  department_name AS department
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  JOIN department ON employee_role.department_id = department.id`

  connection.query(query, function (err, res) {
    let depotArr = []
    for (let i = 0; i < res.length; i++){
      depotArr.includes(res[i].department) ? false: depotArr.push(res[i].department);
    }
    inquirer.prompt({
      name: "depotChoice",
      type: "list",
      message: "Select the department you want to view the budget of",
      choices: depotArr
    }).then(answer => {
      let depotFilter = res.filter(item => item.department === answer.depotChoice)
      let depotSalary = depotFilter.map(a => a.salary);
      var budget = depotSalary.reduce(function(a, b){
        return a + b;
    }, 0);
    console.log("\n" + depotFilter[0].department + "'s department budget: $" + budget + "\n")
    runEmployeeEdit();
    })
  })

};