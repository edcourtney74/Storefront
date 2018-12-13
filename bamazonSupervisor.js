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
                addDepartment();
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
        data = [["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]];

        // Use for loop to go through each item returned to display in table
        for (let i = 0; i < res.length; i++) {
            // Push each value into initialArray
            initialArray.push(res[i].department_id);
            initialArray.push(res[i].department_name);
            initialArray.push("$" + res[i].overhead_costs);
            initialArray.push("$" + res[i].product_sales);
            initialArray.push("$" + (res[i].product_sales - res[i].overhead_costs));

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
                    alignment: 'right',
                    minWidth: 5
                },
                1: {
                    alignment: 'left',
                    minWidth: 5
                },
                2: {
                    alignment: 'left',
                    minWidth: 5
                },
                3: {
                    alignment: 'right',
                    minWidth: 5
                },
                4: {
                    alignment: 'right',
                    minWidth: 5
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
    // Call displayFunction with query, will group by department_name
    display("SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_name ORDER BY departments.department_id", anotherTask);
}

// Function to add a new department
function addDepartment() {
    // Get info from supervisor on department to add
    inquirer.prompt([
        {
            // Get department_name
            type: "input",
            name: "department",
            message: "What is the name of the department you would like to add?"
        },
        {
            // Get overhead costs
            type: "input",
            name: "overhead",
            message: "What are the overhead costs for the department?",
            validate: function (price) {
                // If the user input is a number...
                if (isNaN(price) === false) {
                    return true;
                }
                console.log("\n\nPlease make sure to enter a number.\n");
                return false;
            }
        }        
    ]).then(function (answer) {
        // Insert new department into database
        connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department,
          overhead_costs: parseFloat(answer.overhead)
        },
        function(err) {
          if (err) throw err;
        // Ask for another task
        anotherTask();        
        }
      );
    })
}

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

// MAIN PROCESS================================================================
supervisorTask();