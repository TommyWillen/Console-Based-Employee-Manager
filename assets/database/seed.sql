INSERT INTO department (department_name)
VALUES ("Sales");

INSERT INTO department (department_name)
VALUES ("Front End Development");

INSERT INTO employee_role (title, salary, department_id, is_manager)
VALUES ("Sales Lead", 120000, 1, true);

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Associate", 85000, 1);

INSERT INTO employee_role (title, salary, department_id, is_manager)
VALUES ("Senior Front End Developer", 125000, 2, true);

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Front End Developer", 95000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Frank", "Normal", 2, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Salley", "Stevenson", 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jans", "Jansson", 4, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Sean", "O'Tole", 1);