// npm packages required for this app to function
const inquirer = require("inquirer");
const mysql = require("mysql");
require("dotenv").config();
const text = require("./assets/scripts/text")

// be sure to set up a .env file for all of your required inputs
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
// connects to database
connection.connect(function (err) {
  if (err) throw err;
  // this is an ascii art that displays once the program start up
  text();
  runEmployeeEdit();
});

// first question to be called in the run employee edit function
const initQuest = {
  name: "initialQ",
  type: "list",
  message: "What would you like to do?",
  choices: [
      { name: "Employee Hub", value: "emp"},
      { name: "Employee Role Hub", value: "role" },
      { name: "Department Hub", value: "depot"},
      { name: "Exit application", value: "exit" },
  ]
}
// questions to be called in the employee hub menu
const empInit = {
  name: "empInitQ",
  type: "list",
  message: "Welcome to the Employee Hub! What would you like to do?",
  choices: [
      { name: "View employees", value: "view"},
      { name: "Add an employee", value: "add" },
      { name: "Update employee information", value: "update"},
      { name: "Remove employee", value: "remove"},
      { name: "Back to main", value: "back"}
  ]
}
// question for the employee view function
const empViewQ = {
  name: "empView",
  type: "list",
  message: "Which employees would you like to view?",
  choices: [
      { name: "View all employees", value: "all" },
      { name: "View employees by department", value: "depot" },
      { name: "View employees by role", value: "role" },
      { name: "View employees by manager", value: "mang"},
      { name: "Return to employee hub", value: "return"}
  ]
}
// question for the employeeUpdate menu
const empUpdateQ = {
name: "empUpQuest",
type: "list",
message: "What do you want to update?",
choices: [
  { name: "Update employee role", value: "role"},
  { name: "Update employee manager", value: "mang"},
  { name: "Return to employee hub", value: "return"}
]
}
// question for the employee role hub
const roleInit = {
  name: "roleInitQ",
  type: "list",
  message: "Welcome to the Employee Role Hub! What would you like to do?",
  choices: [
      { name: "View all roles", value: "view"},
      { name: "Add an employee role", value: "add" },
      { name: "Remove employee role", value: "remove"},
      {name: "Return to main", value: "return"},
  ]
}
// question for the department hub
const depotInit = {
  name: "depotInitQ",
  type: "list",
  message: "Welcome to the Department Hub! What would you like to do?",
  choices: [
      { name: "View all departments", value: "view"},
      { name: "Add a department", value: "add" },
      { name: "Remove department", value: "remove"},
      { name: "View department budget", value: "budget"},
      { name: "Return to main", value: "return"}
  ]
}

// this the main functions that uses a switch to direct the user to the appropriate task to be completed.
const runEmployeeEdit = () => {
  inquirer
    .prompt(initQuest).then(response => {
      switch (response.initialQ) {
        case "emp": empHubFunc();
        break;
        case "role": roleHubFunc();
        break;
        case "depot": depotHubFunc();
        break;
        case "exit": connection.end();
        break;
      }
    })
}
// this switch statement directs the user to all of the options for editing/viewing employees
const empHubFunc = () => {
    inquirer.prompt(empInit).then(answer => {
        switch(answer.empInitQ) {
            case "view": empViewHub();
            break;
            case "add": addEmpFunc();
            break;
            case "update": empUpdateHub();
            break;
            case "remove": removeEmpFunc();
            break;
            case "back": runEmployeeEdit();
            break;
        }
    })
}
// this switch statement handles which function is called based on what employees the user wishes to view
const empViewHub = () => {
  inquirer.prompt(empViewQ).then(answer => {
    switch(answer.empView) {
      case "all": viewAllFunc();
      break;
      case "depot": viewDepotFunc();
      break;
      case "role": viewRoleFunc();
      break;
      case "mang": viewManagerFunc();
      break;
      case "return": empHubFunc();
    }
  })
}
// this switch statement hangles which function is called based on what aspect of the employee is updated
const empUpdateHub = () => {
  inquirer.prompt(empUpdateQ).then(answer => {
    switch(answer.empUpQuest) {
      case "role": empRoleFunc();
      break;
      case "mang": empManFunc();
      break;
      case "return": empHubFunc();
      break;
    }
  })
}
// this switch statement directs the user to all of the options for editing/viewing employee roles
const roleHubFunc = () => {
  inquirer.prompt(roleInit).then(answer => {
    switch (answer.roleInitQ) {
      case "view": roleFunc();
      break;
      case "add": addRoleFunc();
      break;
      case "remove": removeRoleFunc();
      break;
      case "return": runEmployeeEdit();
    }

    }) 
}
// this switch statement directs the user to all of the options for editing/viewing departments
const depotHubFunc = () => {
  inquirer.prompt(depotInit).then(answer => {
    switch (answer.depotInitQ) {
      case "view": depotsFunc();
      break;
      case "add": addDepotFunc();
      break;
      case "remove": removeDepotFunc();
      break;
      case "budget": budgetFunc();
      break;
      case "return": runEmployeeEdit();
      break;
    }
  })
}

// this function queries the database and returns all of the employee information in a console table
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
// this function queries the database for departments then asks to user to select one. It then uses the users input to query the database and returns all of the employee information for that specific department in a console table
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
// this function queries the database for managers then asks to user to select one. It then uses the users input to query the database and returns all of the employee information for that specific manager in a console table
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
// this function queries the database for roles then asks to user to select one. It then uses the users input to query the database and returns all of the employee information for that specific role in a console table
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
// this function first queries the database for information about all employees. It then asks for employee information and the department they are joining. Based on their department choice, the user is then asked to select roles and managers from a tailored list. It takes all of this information and inserts the employee information into the database.
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
// this function queries the database for an employee list and uses as a choice for the first question. The user then selects the role for the user based on a list of roles. Finally the database is updated with the new employee role.
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
// this function the database for an employee list and a manager list. It then asks to user to select the employee and their new manager and then updates the database with the new information.
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
// this function queries the database for an employee list and has the user select the employee they would like to remove. It asks for confirmation and will delete the employee from the database if the user confirms it.
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
      res.forEach(emp => (emp.name === ans.empChoice) ? empId.push(emp.id) : false);
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
// this function queries the database for employee roles and displays the information as a console table
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
// this function queries the database for a department list and asks the user to input a role title, select a department, and salary. It also asks if this is a managerial role and inserts the information into the database
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
// this function queries the database for a employee role list and allows the user to select the one they wish to remove and then asks for confirmation. If confirmed, the role information will be deleted from the database.
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
        message: "Warning: Removal of this role is permenant and will be removed from all employees with this role. Do you still want to proceed?"
      }
    ]).then(ans => {
      const { roleRemove, delConfirm } = ans
      if (delConfirm === false) {
        runEmployeeEdit();
      } else {
        const delId = [];
        res.forEach(id => (id.title === roleRemove) ? delId.push(id.id) : false);
        const query2 = `DELETE FROM employee_role WHERE id = ?`
        connection.query(query2, [delId], (err, res) => {
          console.log("\n The position, " + roleRemove + " has been successfully removed! \n")
          runEmployeeEdit();
        })
      }
    })
  })


};
// this function queries the database for departments and displays the information as a console table
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
// this function ask for the name of the new department to be added and inserts it into the database.
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
// this function queries the database for a department list and allows the user to select the one they wish to remove and then asks for confirmation. If confirmed, the department information will be deleted from the database.
const removeDepotFunc = () => {
  const query = `SELECT * FROM department`
  connection.query(query, (err, res) => {
    depotList = [];
    res.forEach(depot => depotList.push(depot.department_name))
    inquirer.prompt([
      {
        name: "depotDel",
        type: "list",
        message: "What department would you like to remove?",
        choices: depotList
      },
      {
        name: "delConfirm",
        type: "confirm",
        message: "Warning: Removal of this department is permenant and will be removed from all roles and employees from this department. Do you still want to proceed?"
      }
    ]).then(ans => {
      depotId = [];
      res.forEach(id => (ans.depotDel === id.department_name) ? depotId.push(id.id) : false)
      query2 = `DELETE FROM department WHERE id = ?`;
      connection.query(query2, [depotId], (err, res) => {
        console.log("\n The " + ans.depotDel + " department has been removed! \n");
        runEmployeeEdit();
      })
    })
  })

};
// this function queries the salaries and department names for all employees. It then asks the user to select one department and adds the salaries of all employees for that department and displays it in a console log
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