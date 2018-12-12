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
// Function to ask manager what task to run and call corresponding function
function managerTask() {
    inquirer.prompt([
        // Ask manager which task to run
        {
            type: "list",
            name: "task",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What would you like to do?"
        }
    ]).then(function (answer) {
        // Call functions based on manager selection
        switch (answer.task) {
            case ("View Products for Sale"):
                viewProducts();
                break;
            case ("View Low Inventory"):
                lowInventory();
                break;
            case ("Add to Inventory"):
                addInventory();
                break;
            case ("Add New Product"):
                console.log("View product function here");
                break;
            default:
                console.log("Please choose a task.");
        }
    })
}

// Function to display query results in a table
function display(taskQuery) {
    // Query the database for all items
    connection.query(taskQuery, function (err, res) {
        if (err) throw err;

        // Save res to global variable for use in other functions
        results = res;

        // Create initialArray variable to hold values returned
        var initialArray = [];
        // Create data variable to hold initialArray values, plus column headers
        data = [["Item ID", "Item", "Category", "Price", "Quantity Left"]];

        // Use for loop to go through each item returned to display in table
        for (let i = 0; i < res.length; i++) {
            // Push each value into initialArray
            initialArray.push(res[i].item_id);
            initialArray.push(res[i].product_name);
            initialArray.push(res[i].department_name);
            initialArray.push("$" + res[i].price);
            initialArray.push(res[i].quantity);

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
        
        // Call anotherTask function to show the user prompt
        anotherTask();
    })
}

// Function to show all items
function viewProducts() {
    // Call displayFunction with query
    display("SELECT * FROM products");    
};

// Function show low inventory
function lowInventory() {
    // Call displayFunction with query
    display("SELECT * FROM products WHERE quantity < 5");
};

// Function to add to inventory
function addInventory() {
    // Ask manager for item #
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Please enter the correct item #:"
        }
    
    ]).then(function (answer) {
        // Convert user input to integer
        var managerItem = parseInt(answer.item)

        // If the manager's input is not a number, log to the manager to input a number and rerun this function
        if (isNaN(managerItem)) {
            console.log("I'm sorry. Please make sure to enter a number.\n");
            addInventory();

        } else {
            // If it is a number, check to see if it matches an item id in the database
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === managerItem) {
                    // If it does match, save the info to chosenItem variable
                    chosenItem = results[i];
                    break;
                }
            }
            // Check to see if chosenItem has any data.
            if (!chosenItem) {
                // If it doesn't have data, tell the manager to enter a different item # and prompt again
                console.log("\nI'm sorry. I can't find that item #. Please try again.\n")
                addInventory();

            } else {
                inquirer.prompt([
                    // Ask manager how many to add to the quantity
                    {
                        type: "input",
                        name: "quantity",
                        message: "You selected " + chosenItem.product_name + ". How many of this product would you like to add?"
                    }
                ]).then (function(answer1) {
                    // Convert user input to integer
                    var managerQuantity = parseInt(answer1.quantity);

                    // If the manager's input is not a number, log to the manager to input a number and rerun this function
                    if (isNaN(managerQuantity)) {
                        console.log("I'm sorry. Please make sure to enter a number.\n");
                        addInventory();
    
                    } else {
                        // Send new query to update database          
                        connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                quantity: (chosenItem.quantity + managerQuantity)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        
                        function (err) {
                        if (err) throw err;
                        
                        // Display products and ask for another task
                        viewProducts();    
                        }
                    )}
                });
            }
        }
    }    
)};

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
            managerTask();

        } else {
            // If the user does not want to shop, give instructions on how to start back up
            console.log("\nThank you. Type in 'node bamazonManager' when you want to do another task.");
            connection.end();
        }
    })
};


//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// MAIN PROCESS====================================================================
managerTask();
