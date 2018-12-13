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
                addItem();
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


        // Run callback function
        func();
    })
}

// Function to show all items
function viewProducts() {
    // Call displayFunction with query
    display("SELECT * FROM products", anotherTask);
};

// Function show low inventory
function lowInventory() {
    // Call displayFunction with query
    display("SELECT * FROM products WHERE quantity < 5", anotherTask);
};

// Function to add to inventory
function addInventory() {
    // Display products first so manager can see the info
    display("SELECT * FROM products", inventoryPrompt);
}

// Function to start inventory prompts
function inventoryPrompt() {
    // Ask manager for item #
    inquirer.prompt([
        {
            type: "input",
            name: "item",
            message: "Please enter the item # for the product you'd like to add to:",
            validate: function (item) {
                // If the user input is a number...
                if (isNaN(item) === false) {
                    // Check to see if it matches an item id in the database
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].item_id === parseInt(item)) {
                            // If it does match, save the info to chosenItem variable
                            chosenItem = results[i];
                            return true;
                        }
                    }
                }
                // If the user input is not a number or does not match an existing ID #, alert the user
                console.log("\n\nI'm sorry. You did not enter a correct ID number.\n");
                return false;
            }
        },
        // Ask manager how many to add to the quantity
        {
            type: "input",
            name: "quantity",
            message: "How many of this product would you like to add?",
            validate: function (quantity) {
                // If the user input is a number...
                if (isNaN(quantity) === false) {
                    return true;
                }
                console.log("\n\nPlease make sure to enter a number.\n");
                return false;
            }
        }
        ]).then(function (answer) {
            var managerQuantity = parseInt(answer.quantity);

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
            )
        })
    };
    
    
// Function to add a new item
function addItem() {
    // Get info from manager on item to add
    inquirer.prompt([
        {
            // Get product_name
            type: "input",
            name: "product",
            message: "What is the name of the product you would like to add?"
        },
        {
            // Get department
            type: "list",
            name: "department",
            message: "What department is the product in?",
            choices: ["Books", "Clothing","Electronics","Kitchen","Sports","Toys","Other"]
        },        
        {
            // Get price
            type: "input",
            name: "price",
            message: "What is the price per unit of the product?",
            validate: function (price) {
                // If the user input is a number...
                if (isNaN(price) === false) {
                    return true;
                }
                console.log("\n\nPlease make sure to enter a number.\n");
                return false;
            }
        },
        {
            // Get price
            type: "input",
            name: "quantity",
            message: "What quantity of the product is available?",
            validate: function (quantity) {
                // If the user input is a number...
                if (isNaN(quantity) === false) {
                    return true;
                }
                console.log("\n\nPlease make sure to enter a number.\n");
                return false;
            }
        }
    ]).then(function (answer) {
        // Insert new item into database
        connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: parseFloat(answer.price),
          quantity: parseFloat(answer.quantity)
        },
        function(err) {
          if (err) throw err;
        // Display products and ask for another task
        viewProducts();        
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
            managerTask();

        } else {
            // If the user does not want to shop, give instructions on how to start back up
            console.log("\nThank you. Type in 'node bamazonManager' when you want to do another task.");
            connection.end();
        }
    })
};




// MAIN PROCESS====================================================================
managerTask();
