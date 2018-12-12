-- Drop database if it already exists
DROP DATABASE IF EXISTS bamazon_db;

-- Create database
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- Create "products" table in database
CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(60) NULL,
    department_name VARCHAR(60) NULL,
    price DECIMAL(10, 2) NULL,
    quantity INT(10) NULL,
    PRIMARY KEY (item_id)
);

-- Products to add to database
INSERT INTO products (product_name, department_name, price, quantity) VALUES 
("Slinky", "Toys", 4.99, 72),
("Men's jeans", "Clothing", 42, 32),
("A Tale of Two Cities", "Books", 6.99, 105),
("Women's slippers", "Clothing", 7.50, 212),
("Popcorn popper", "Kitchen", 17.99, 83),
("Chewbacca action figure", "Toys", 12.50, 133),
("Pot and pan set", "Kitchen", 210.00, 53),
("Baseball mitt", "Sports", 45.13, 21),
("The Underground Railroad", "Books", 14.92, 103),
("Playstation 4", "Electronics", 299.99, 258);