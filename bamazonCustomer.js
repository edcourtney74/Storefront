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

var results;
var chosenItem;

// Function to display items
function showItems() {
    // Query the database for all items available
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
            message: "Please enter the ID number of the item you would like to order."
        }
    ]).then(function (answer) {
        // Convert user input to integer
        var userItem = parseInt(answer.item)

        // If the user's input is not a number, log to the user to input a number and rerun this function
        if (isNaN(userItem)) {
            console.log("I'm sorry. Please make sure to enter a number.\n");
            getItem();

        } else {
            // If it is a number, check to see if it matches an item id in the database
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === userItem) {
                    // If it does match, save the info to chosenItem variable
                    chosenItem = results[i];
                    break;
                }
            }
            // Check to see if chosenItem has any data.
            if (!chosenItem) {
                // If it doesn't have data, tell the user to enter a different item # and prompt again
                console.log("\nI'm sorry. I can't find that item #. Please try again.\n")
                getItem();

            } else {
                // If it does have data, call checkInventory
                checkInventory();
            }
        }
    })
}

function checkInventory() {
    // Ask user how much of the product they would like to buy 
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many of this item would you like to buy?"
        }
    ]).then(function (answer) {

        // Convert user input to integer
        var userQuantity = parseInt(answer.quantity)

        // If the user's input is not a number, log to the user to input a number and rerun this function
        if (isNaN(userQuantity)) {
            console.log("\nI'm sorry. Please make sure to enter a number.\n");
            checkInventory();

        } else {
            // If it is a number, check to see if there is enough inventory
            if (userQuantity <= chosenItem.quantity) {
                // If there is enough inventory...
                console.log("Next function call will go here");
                // Show the user the total cost 
                console.log("Thank you for your order. Your total cost is $" + (userQuantity * chosenItem.price) + ".");
            
            } else {
                // If there isn't enough inventory, let the user know.
                console.log("\nYou requested a quantity of " + userQuantity + " but the quantity in stock is only " + chosenItem.quantity + ". Please try a different quantity.\n");
                // Let the user try a different amount
                checkInventory();
            }
        }
    })
}

// Ask the customer if they would like to make another purchase.
//     // If so...
//     // Go through process again

//     // If not...
//     // Exit app and give instructions how to restart

// MAIN PROCESS====================================================================
showItems();