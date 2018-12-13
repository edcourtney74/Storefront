# Storefront
A command-line storefront app using Node.js and MySQL that allows customers, managers and supervisors to interact with the store's database in real-time.

## Overall Features
  * Prompts from the command line lead the user through the process.
  * After a task is completed, the user is asked if they would like to continue with another task. If so, they are given prompts to continue. If not, the user is given instructions for how to continue later, and the session is ended.
  * Validation throughout the prompts helps user enter correct information.
  * Uses two tables (products and departments) in one database.
  * Uses mySQL to track updates to the database.
  * Product table includes item ID (generated automatically), product name, product department, price, quantity and product_sales. However, product_sales is only viewable by the supervisor.
  * Department table includes department ID, department name and overhead costs.
  * Tables are displayed in easy-to-read format.

## Customer View
  * The customer initiates the session by typing "node bamazonCustomer.js".
  * The products table is displayed, and the customer is asked for the ID number of the product they'd like to purchase.
  * If the customer input does not match the database, the customer is prompted to try again.
  * The customer is then asked the quantity they would like to buy.
  * The database is updated with the order information.
  * The customer receives a thank-you prompt that includes the total cost of the purchase.
#### Screencast
  * Below the customer purchases all 72 Slinkies, and when the table is displayed again, the item's quantity is now 0.
  ![Customer photo](https://github.com/edcourtney74/Storefront/blob/master/images/customer_process.gif "Customer process")


## Manager View
  * The manager initiates the session by typing "node bamazonManager.js".
  * The manager is given four tasks to choose from.
### View Products for Sale
  * Displays all products, the same as customer view. Does not include product sales, which is viewable only by a supervisor. 
### View Low Inventory
  * Displays all products with a quantity of less than five remaining.
### View Add Inventory
  * Allows the manager to add more quantity to a specific item.
### Add New Product
  * Asks the manager for the new product's name, department, price and quantity. The produce is then added to the database.
#### Screencasts
  * Below the manager is given a list of tasks. The manager selects View Products for Sale and sees the same view the customer does. When the manager selects View Low Inventory, the Slinky item information is displayed because the previous customer bought all the Slinkies. The manager then selects Add to Inventory and adds 15 back to the Slinky item. When the manager selects View Products for Sale again, the Slinky now has a quantity of 15.
  ![Manager-inventory photo](https://github.com/edcourtney74/Storefront/blob/master/images/manager_add_inv.gif "Manager inventory process")

  * Below the manager selects Add New Product. After following the prompts and entering the information, the new products are automatically displayed again, and the new pizza stone item is in the database now.
  ![Manager-add-item photo](https://github.com/edcourtney74/Storefront/blob/master/images/manager_add_item.gif "Manager add item process")

## Supervisor View
  * The supervisor initiates the session by typing "node bamazonSupervisor.js".
  * The supervisor is given two tasks to choose from.  
### View Product Sales by Department
  * Shows the supervisor the department ID, department name, overhead costs, product sales and total profit of the department.
  * The information for product sales is brought in from the products table.
  * The total profits information is not stored in a database. It is calculated at the time of the request.
  * Results are displayed in alphabetical order by the department, making it easier to find a department than by looking for department ID.
### Create New Department
  * Supervisor enters the department name and overhead costs. 
  * A department ID is assigned automatically.
  * New department is added to the database.
#### Screencast
  * Below the supervisor looks at a department listing. Then the supervisor adds a department, entering a name and the overhead costs. Then when the listing is shown again, the new department has been added and is shown alphabetically.
  ![Supervisor photo](https://github.com/edcourtney74/Storefront/blob/master/images/supervisor.gif "Supervisor process")

## Error Handling Examples
  * The below example in Manager View/Add to Inventory is an example of error handling found throughout the app. When selecting an item ID, validation makes sure the item ID number is already contained in the database. If it's not, the user is prompted to enter a correct ID number. When the manager inputs a quantity to add, validation makes sure the manager input was actually a number. 
  ![Error handling photo](https://github.com/edcourtney74/Storefront/blob/master/images/error_handling.gif "Error handling")

