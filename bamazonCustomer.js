// Import mysql, inquirer and table npm's
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
// Function to show all items
function showItems() {
    // Query the database for all items
    connection.query("SELECT * FROM products", function (err, res) {
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

        // Call getItem function to show the user prompt
        getItem();
    });
}

// Function to get user order
function getItem() {
    inquirer.prompt([
        // Ask user for the item ID being ordered
        {
            type: "input",
            name: "item",
            message: "Please enter the ID number of the item you would like to order.",
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
        }
    ]).then(function (answer) {
        // Call checkInventory function
        checkInventory();
    })
}

function checkInventory() {
    // Ask user how much of the product they would like to buy 
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many of this item would you like to buy?",
            validate: function (quantity) {
                // If the user input is a number...
                if (isNaN(quantity) === false) {
                    return true;
                }
                console.log("\n\nI'm sorry. Please enter a number only.\n");
                return false;
            }
        }
    ]).then(function (answer) {

        // Convert user input to integer
        var userQuantity = parseInt(answer.quantity);

        // If it is a number, check to see if there is enough inventory
        if (userQuantity <= chosenItem.quantity) {
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        quantity: (chosenItem.quantity - userQuantity),
                        product_sales: (chosenItem.price * userQuantity)
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function (err) {
                    if (err) throw err;
                    // If there is enough inventory...
                    // Show the user the total cost 
                    console.log("\nThank you for your order. Your total cost is $" + ((userQuantity * chosenItem.price).toFixed(2)) + ".\n");

                    // Ask if they want to shop more
                    shopAgain();
                });
        } else {
            // If there isn't enough inventory, let the user know.
            console.log("\nYou requested a quantity of " + userQuantity + " but the quantity in stock is only " + chosenItem.quantity + ". Please try a different quantity.\n");
            // Let the user try a different amount
            checkInventory();
        }    
    })
}

function shopAgain() {
    inquirer.prompt([
        {
            // Ask the user if they would like to buy something else
            type: "confirm",
            name: "shop",
            message: "Do you want to buy something else?"
        }
    ]).then(function (answer) {
        if (answer.shop) {
            // If yes, reset global variables
            results = "";
            chosenItem = "";
            // start process again
            showItems();

        } else {
            // If the user does not want to shop, give instructions on how to start back up
            console.log("\nThank you for coming. If you decide to start shopping again, just type in 'node bamazonCustomer'.");
            connection.end();
        }
    })
}

// MAIN PROCESS====================================================================
showItems();