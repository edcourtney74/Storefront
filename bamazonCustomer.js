// Import mysql, inquirer and table npm's
var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");

// Create connection info to the database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// Function to display items and give user prompts
function takeOrder() {
    // Query the database for all items available
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
              
        // Create initialArray variable to hold values returned
        var initialArray = [];
        // Create dataArray variable to hold initialArray values
        var dataArray = [];

        // Use for loop to go through each item returned
        for (let i = 0; i < res.length; i++) {
            // Push each value into initialArray
            initialArray.push(res[i].item_id);
            initialArray.push(res[i].product_name);
            initialArray.push(res[i].department_name);
            initialArray.push(res[i].price);
            initialArray.push(res[i].quantity);
            
            // Push the new initialArray into dataArray
            dataArray.push(initialArray);

            // Empty initialArray for the next loop
            initialArray = [];           
        }
     
        // Show all results using table npm
        let config, data, output;
                    
        // Set data to query response
        data = dataArray;

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
        console.log(output);
    })
}

// Ask user for the product ID they would like to buy

// Ask user how many units they would like to buy

// Check to see if there is enough inventory to fulfill the request

    // If not...
    // Tell the customer there is not enough inventory
    // Stop the order

    // If so...
        // Update the quantity remaining in the database
        // Show the customer the cost of the purchase

// Ask the customer if they would like to make another purchase.
    // If so...
    // Go through process again

    // If not...
    // Exit app and give instructions how to restart

// MAIN PROCESS====================================================================
takeOrder();