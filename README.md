# Console Based Employee Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md)

## Description

This application is a console based program that allows a user to manipulate an employee database to add, remove, update, and view employee, employee role, and department information.

## Table of Contents
    
- [Description](#description)
- [Installation](#Installation)
- [Usage](#Usage)
- [License](#License)
- [Contributing](#Contributing)
- [Questions](#Questions)
    
## Installation

This application requires setting up the database using mySQL and installing the mySQL, dovenv, and inquirer dependencies.

To install the dependencies you will need to run: npm i

    
## Usage

Click the gif below to view the tutorial video:

[![Click to view the tutorial video](/assets/gifs/Console-Based-Employee-Manager-Tutorial.gif)](https://youtu.be/e4M56eS-Mwc)

This application is a convient way to manipulate an employee database. It allows users to view, add, remove, and update elements about each employee as well as their roles, managers, and departments.

This application utilizes inquirer prompts and switch statements to traverse the application for each of the categories.

The biggest challenged I faced when making this app was with managerial roles. The reason was because originally if a manager did not have employees assigned under them, they would not populate on the list. To fix this I added the is_manager column to the employee_role table to set what roles are managerial roles.
    
## License
    
The project is covered under the MIT license.
    
## Contributing
 
This is an open source application and welcome for contribution. If you would like to contribute, you can fork my repo and submit any pull request for any features you would like added.    
Contributions are protected by the contributor covenant V2.0. If you have any new features you would like to see added or want to report abuse please contact me at TommyWillen12@gmail.com 
Click [here](https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md) for more information regarding contributor covenant V2.0.    

    
## Questions
    
GitHub Profile: [TommyWillen](https://github.com/TommyWillen)

Email: TommyWillen12@gmail.com