-- this first line is only used in the dev stage. you will want to remove it once your db is deployed.
DROP DATABASE IF EXISTS employeeDB;
CREATE database employeeDB;

USE employeeDB;
-- this is the employee table schema that links with the employee_role table and with itself for manager info
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);
-- this is the department table schema that links with the employee_role table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    PRIMARY KEY(id)
);
-- this is the employee_role schema that links with the employee table and the department table. the is_manager boolean allows the dev to easily identify if an employee is in a managerial role regardless if it has any employees under their purview.
CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50),
    salary INT NOT NULL,
    department_id INT NOT NULL,
    is_manager boolean default false,
    PRIMARY KEY(id)
);