// Import mysql, inquirer and table npm's and bamazonCustomer.js
var mysql = require("mysql");
var inquirer = require("inquirer");
var { table } = require("table");

// Create connection info to the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// GLOBAL VARIABLES===============================================================
// Variable to hold database results to use in other functions 
var results;
// Variable to hold customer's chosen item to use in other functions
var chosenItem;

// FUNCTIONS========================================================================
// Function to ask supervisor what task to run and call corresponding function
function supervisorTask() {
    inquirer.prompt([
        // Ask manager which task to run
        {
            type: "list",
            name: "task",
            choices: ["View Product Sales by Department", "Create New Department"],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        // Call functions based on manager selection
        switch (answer.task) {
            case ("View Product Sales by Department"):
                viewSales();
                break;
            case ("Create New Department"):
                console.log("Create New Department function here");
                break;
            default:
                console.log("Please choose a task.");
        }
    })
}

// Function to display query results in a table
function display(taskQuery, func) {
    // Query the database for all items
    connection.query(taskQuery, function (err, res) {
        if (err) throw err;

        // Save res to global variable for use in other functions
        results = res;

        // Create initialArray variable to hold values returned
        var initialArray = [];
        // Create data variable to hold initialArray values, plus column headers
        data = [["Department ID", "Department Name", "Overhead Costs"]];

        // Use for loop to go through each item returned to display in table
        for (let i = 0; i < res.length; i++) {
            // Push each value into initialArray
            initialArray.push(res[i].department_id);
            initialArray.push(res[i].department_name);
            initialArray.push("$" + res[i].overhead_costs);
            // initialArray.push("$" + res[i].product_sales);
            // initialArray.push(res[i].quantity);

            // Push the new initialArray into dataArray
            data.push(initialArray);

            // Empty initialArray for the next loop
            initialArray = [];
        }

        // Show all results using table npm
        let config, output;

        // Set column configuration
        config = {
            columns: {
                0: {
                    alignment: 'left',
                    minWidth: 10
                },
                1: {
                    alignment: 'left',
                    minWidth: 10
                },
                2: {
                    alignment: 'left',
                    minWidth: 10
                },
                3: {
                    alignment: 'right',
                    minWidth: 10
                },
                4: {
                    alignment: 'right',
                    minWidth: 10
                }
            }
        };
        // Define output
        output = table(data, config);

        // Console log table
        console.log("\n\n" + output);


        // Run callback function
        func();
    })
}

// Function for viewing product sales by department
function viewSales() {
    // Call displayFunction with query
    display("SELECT * FROM departments", anotherTask);
}
// 4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

//    * Hint: You may need to look into aliases in MySQL.

//    * Hint: You may need to look into GROUP BYs.

//    * Hint: You may need to look into JOINS.

//    * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

function anotherTask() {
    inquirer.prompt([
        {
            // Ask the user if they would like to buy something else
            type: "confirm",
            name: "anotherTask",
            message: "Do you want to do something else?"
        }
    ]).then(function (answer) {
        if (answer.anotherTask) {
            // If yes, reset global variables
            results = "";
            chosenItem = "";
            // Display task options
            supervisorTask();

        } else {
            // If the user does not want to shop, give instructions on how to start back up
            console.log("\nThank you. Type in 'node bamazonSupervisor' when you want to do another task.");
            connection.end();
        }
    })
};

// MAIN PROCESS
supervisorTask();