# Bamazon
Exercise to work with mysql

This is a project that works with MySQL to show how a Node file can read and write to a database.

Be sure to npm install as these files us:

mysql
inquirer
console.table

First, you'll want to set up the database.  Run the bamazon.sql file in your MySQL to set up the appropriate database, table, and items.

To run it as a customer, run

node bamazonCustomer.js

You will see the products, department, price, and amount in stock.  You will enter the number of the item you wish to order.  If it cannot be found, it will let you know and you can try again.  After choosing an item, you can then enter how many you wish to order.  If the number is negative or if there isn't enough in stock, the system will let you know and you can try to order again from the start.

At any time, enter q (upper or lowercase) to quit.

To run it as a manager, run

node bamazonManager.js

You have the following options:

View Products for Sale:  Shows the inventory.  
View Low Inventory:  Shows any items that have only 5 or less in stock.  
Add to Inventory:  Add stock to inventory.  You'll be asked for which item and how many to add (Note:  Not total).  
Update Price:  Adjust the price of an item.  You'll be asked for which item and what the new price is.  
Add New Product:  Create a new item.  You'll be asked for the name, department, price, and amount in stock.  
Delete Product:  Delete an item.  You'll be asked which item to delete from inventory.

As with the Customer version, if you choose an item that isn't listed, it will let you know and you'll start over.  If you try to enter negative inventory when adjusting inventory or a negative price when adjusting prices, it will let you know and you can try again.