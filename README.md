# Storefront
A command-line storefront app that allows customers, managers and supervisors to interact with the store's database.

## Overall Features
  * Prompts from the command line lead the user through the process.
  * Validation throughout the prompts helps user enter correct information.
  * Uses mySQL to track updates to the product database.
  * Database includes item ID (generated automatically), product name, product department, price and quantity.
  * Database is displayed in easy-to-read format.

## Customer View
  * The customer initiates the session by typing "node bamazonCustomer.js".
  * The database is displayed, and the customer is asked for the ID number of the product they'd like to purchase.
  * If the customer input does not match the database, the customer is prompted to try again.
  * The customer is then asked the quantity they would like to buy.
  * The database is updated with the order information.
  * The customer receives a thank-you prompt that includes the total cost of the purchase.
  * The customer is asked if they would like to make another purchase. 

