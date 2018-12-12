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

function managerTask() {
    inquirer.prompt([
        // Ask manager which task to run
        {
            type: "list",
            name: "task",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What would you like to do?"
        }
    ]).then(function(answer) {
        // Call functions based on manager selection
        switch(answer.task) {
            case ("View Products for Sale"):
                console.log("View Productions function here");
                break;
            case ("View Low Inventory"):
                console.log("View inventory function here");
                break;
            case ("Add to Inventory"):
                console.log("Add inventory function here");
                break;
            case ("Add New Product"):
                console.log("View product function here");
                break;
            default:
                console.log("Please choose a task.");
          }




    })
}


//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// MAIN PROCESS====================================================================
managerTask();
