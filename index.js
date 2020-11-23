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

  connection.query(query, (err, res) => {
    console.log("\n" + res.length + " employees found! \n");
    let empArr = []
    res.forEach(emp => empArr.push({ Id: emp.ID, Name: emp.name, Title: emp.title, Salary: emp.salary, Department: emp.department, Manager: emp.manager }))

    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// finished
const viewDepotFunc = () => {
  connection.query("Select department.department_name FROM department", (err, res) => {
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
      connection.query(query, [response.empDepotSearch], (err, res) => {
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
    (err, res) => {
      let mangChoice = [];
      res.forEach(mang => mangChoice.push(mang))
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
        connection.query(query, realMang[0].ID, (err, res) => {
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
    res.forEach(role => roleChoice.push(role.title));
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
      connection.query(query, [response.empRoleSearch], (err, res) => {
        console.log("\n" + res.length + " employees found! \n");
        let empArr = []
        res.forEach(emp => empArr.push({ Id: res[i].ID, Name: res[i].name, Title: res[i].title, Salary: res[i].salary, Department: res[i].department, Manager: res[i].manager }))
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

  connection.query(query, (err, res) => {
    let depotChoice = [];
    res.forEach(depot => (depotChoice.includes(depot.department)) ? false : depotChoice.push(depot.department))
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
      res.forEach(mang => (res[i].is_manager && res[i].department === ans.depotChoice) ? managerList.push(res[i].name) : false)
      res.forEach(role => (!roleList.includes(res[i].title) && res[i].department === ans.depotChoice) ? roleList.push(res[i].title) : false)
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
              connection.query(query2, [ans.addFirstName, ans.addLastName, titleChoice[0].role_id, mangChoice[0].ID], (err, res2) => {
                console.log("Employee added! \n")
                runEmployeeEdit();
              })

            })
          } else {
            let titleChoice = res.filter(title => title.title === answer.roleChoice);
            let query2 = `INSERT INTO employee (first_name, last_name, role_id)
        VALUES (?, ?, ?)`
            connection.query(query2, [ans.addFirstName, ans.addLastName, titleChoice[0].role_id], (err, res2) => {
              console.log("Manager added! \n")
              runEmployeeEdit();
            })
          }
        })


    })

  })


};
// finished
const empRoleFunc = () => {
  const query = `SELECT e.id AS ID, 
  concat(e.first_name, " ", e.last_name) AS name, 
  title AS title, e.role_id
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  JOIN department ON employee_role.department_id = department.id
  LEFT JOIN employee m ON e.manager_id = m.id`
  connection.query(query, (err, res) => {
    let roleArr = []
    res.forEach(role => (roleArr.includes(role.title)) ? false : roleArr.push(role.title))

    let empList = res.map(e => e.name);

    inquirer.prompt([
      {
        name: "empRoleUpdate",
        type: "list",
        message: "Who's role would you like to update?",
        choices: empList
      },
      {
        name: "empRoleSelect",
        type: "list",
        message: "What is their new role?",
        choices: roleArr
      }
    ])
      .then(answer => {
        let roleId;
        let empId;
        res.forEach(role => (role.title === answer.empRoleSelect) ? roleId = role.role_id : false);
        res.forEach(emp => (emp.name === answer.empRoleUpdate) ? empId = emp.ID : false);
        const query2 = `UPDATE employee
        SET role_id = ?
        WHERE id = ?`
        connection.query(query2, [roleId, empId], (err, res) => {
          console.log(answer.empRoleUpdate + "'s role has been changed to " + answer.empRoleSelect + "!")
        })
      })

  })


};
// finished
const empManFunc = () => {
  const query = `SELECT e.id AS ID, 
  concat(e.first_name, " ", e.last_name) AS name,
  concat(m.first_name, " ", m.last_name) AS manager,
  is_manager
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  LEFT JOIN employee m ON e.manager_id = m.id`;

  connection.query(query, (err, res) => {
    const mangList = []
    res.forEach(mang => (mang.is_manager) ? mangList.push(mang.name) : false);
    const empList = [];
    res.forEach(emp => empList.push(emp.name));
    inquirer.prompt([
      {
        name: "empChoice",
        type: "list",
        message: "Which employee would you like to update?",
        choices: empList
      },
      {
        name: "mangChoice",
        type: "list",
        message: "Who is their new manager?",
        choices: mangList
      }
    ]).then(ans => {
      let { empChoice, mangChoice } = ans;
      const query2 = `UPDATE employee
      SET manager_id = ?
      WHERE id = ?`
      let mangId;
      let empId;
      res.forEach(mang => (mang.name === mangChoice) ? mangId = mang.ID : false);
      res.forEach(emp => (emp.name === empChoice) ? empId = emp.ID : false);
      connection.query(query2, [mangId, empId], (err, res) => {
        console.log("\n" + empChoice + "'s manager has been changed to " + mangChoice + "!\n")
        runEmployeeEdit();
      })
    })
  })
};
// finished
const removeEmpFunc = () => {
  const query = `SELECT id, concat(e.first_name, " ", e.last_name) AS name
  FROM employee e`
  connection.query(query, (err, res) => {
    const empList = []
    res.forEach(emp => empList.push(emp.name));
    inquirer.prompt([
      {
        name: "empChoice",
        type: "list",
        message: "What is the name of the employee you would like to delete?",
        choices: empList
      },
      {
        name: "deleteConfirm",
        type: "confirm",
        message: "Are you sure you want to delete this employee?"
      }
    ]).then(ans => {
      const empId = []
      res.forEach(emp => (emp.name === ans.empChoice) ? empId.push(emp.id):false);
      if (ans.deleteConfirm) {
        const query2 = `DELETE FROM employee WHERE id = ?`
        connection.query(query2, [empId], (err, response) => {
          console.log("\n" + ans.empChoice + " has been successfully removed from the employee roster \n");
          runEmployeeEdit();
        })
      } else {
        runEmployeeEdit();
      }
    })
  })


};
// finished
const roleFunc = () => {
  const query = `SELECT r.id as ID, r.title, r.salary, department_name
  FROM employee_role r
  JOIN department ON r.department_id = department.id`;

  connection.query(query, (err, res) => {
    console.log("\n" + res.length + " roles found! \n");
    let empArr = []
    res.forEach(emp => empArr.push({ Id: emp.ID, Title: emp.title, Salary: emp.salary, Department: emp.department_name }))
    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// finished
const addRoleFunc = () => {
  const query = `SELECT department_name, id FROM department`
  connection.query(query, (err, res) => {
    const depotList = []
    res.forEach(depot => depotList.push(depot.department_name));
    inquirer.prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the role you wish to create?",
        validate: val => (val.length < 3) ? "Title must be at least 3 or more characters long" : true,
      },
      {
        name: "roleDepot",
        type: "list",
        message: "What department does this role fall under?",
        choices: depotList,
      },
      {
        name: "roleMang",
        type: "confirm",
        message: "Is this a managerial role?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the starting salary of this role?",
        validate: val => (isNaN(parseInt(val))) ? "Must be a number" : true,
      }
    ]).then(ans => {
      const { roleTitle, roleDepot, roleMang, roleSalary } = ans;
      const roleId = [];
      res.forEach(depot => (roleDepot === depot.department_name) ? roleId.push(depot.id) : false);
      const query2 = `INSERT INTO employee_role (title, salary, department_id, is_manager)
    VALUES (?, ?, ?, ?)`
      connection.query(query2, [roleTitle, roleSalary, roleId, roleMang], (err, res) => {
        console.log("\n The role, " + roleTitle + " has been added to the" + roleDepot + " department! \n");
        runEmployeeEdit();
      })
    })
  })


};
// finished
const removeRoleFunc = () => {
  const query = `SELECT id, title
  FROM employee_role`
  connection.query(query, (err, res) => {
    const roleList = [];
    res.forEach(role => roleList.push(role.title));
    inquirer.prompt([
      {
        name: "roleRemove",
        type: "list",
        message: "Which role would you like to remove?",
        choices: roleList
      },
      {
        name: "delConfirm",
        type: "confirm",
        message: "Warning: Removal of this role is perminant and will be removed from all employees with this role. Do you still want to proceed?"
      }
    ]).then(ans => {
      const {roleRemove, delConfirm} = ans
      if (delConfirm === false) {
        runEmployeeEdit();
      } else {
        const delId = [];
        res.forEach(id => (id.title === roleRemove) ? delId.push(id.id):false);
        const query2 = `DELETE FROM employee_role WHERE id = ?`
        connection.query(query2,[delId], (err,res) => {
          console.log("\n The position, " + roleRemove + " has been successfully removed! \n")
          runEmployeeEdit();
        })
      }
    })
  })


};
// finished
const depotsFunc = () => {
  const query = `SELECT * FROM department`;

  connection.query(query, (err, res) => {
    console.log("\n" + res.length + " departments found! \n");
    let empArr = []
    res.forEach(emp => empArr.push({ Id: emp.id, Department: emp.department_name }))
    console.table(empArr);
    console.log("\n")
    runEmployeeEdit();
  })

};
// finished
const addDepotFunc = () => {

  inquirer.prompt({
    name: "depotAdd",
    type: "input",
    message: "What is the name of the department you wish to create?",
    validate: val => (val.length < 3) ? "Title must be at least 3 or more characters long" : true,
  }).then(ans => {
    const query = `INSERT INTO department (department_name)
    VALUES (?)`;
    connection.query(query, [ans.depotAdd], (err, res) => {
      console.log("\n The " + ans.depotAdd + " department has been created!");
      runEmployeeEdit();
    })
  })  
};
// revomve func
const removeDepotFunc = () => {

  runEmployeeEdit();

};
// finished
const budgetFunc = () => {
  const query = `SELECT salary, 
  department_name AS department
  FROM employee e
  JOIN employee_role ON e.role_id = employee_role.id
  JOIN department ON employee_role.department_id = department.id`

  connection.query(query, (err, res) => {
    let depotArr = []
    res.forEach(depot => depotArr.includes(depot.department) ? false : depotArr.push(depot.department));

    inquirer.prompt({
      name: "depotChoice",
      type: "list",
      message: "Select the department you want to view the budget of",
      choices: depotArr
    }).then(answer => {
      let depotFilter = res.filter(item => item.department === answer.depotChoice)
      let depotSalary = depotFilter.map(a => a.salary);
      let budget = depotSalary.reduce((a, b) => a + b, 0);
      console.log("\n" + depotFilter[0].department + "'s department budget: $" + budget + "\n")
      runEmployeeEdit();
    })
  })

};