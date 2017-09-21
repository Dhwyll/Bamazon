require ("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	startShopping();
});

function startShopping() {
	connection.query("SELECT * FROM products", function(err, res) {		// Get the product table
		if (err) throw err;
		console.log("\n");
		console.table(res);												// Display the product table
		inquirer.prompt([												// Get the ID of the product
			{
				type: "input",
				name: "command",
				message: "Which product would you like to order? [Press Q to quit]"
			}
		]).then(function(answers) {
			var orderID = answers.command;
			if (orderID.toUpperCase() === "Q") {						// If the ID of the product is Q
				connection.end();										// End the process
			}
				else {													// Otherwise...
					var idArray = [];									// Get an array of the IDs in case an item was deleted
					for (var i = 0; i < res.length; i++) {
						idArray.push(res[i].item_id);
					}
					if (idArray.indexOf(parseInt(orderID)) !== -1) {	// If the orderID is in the list
						var orderIndex = idArray.indexOf(parseInt(orderID));
						inquirer.prompt([
							{
								type: "input",
								name: "amount",
								message: "How many would you like to order? [Press Q to quit]"
							}
						]).then (function(answers) {
							var orderAmount = answers.amount;			// Set up the amount for the order that can survive scope
							if (orderAmount.toUpperCase() === "Q") {	// If the amount ordered is Q
								connection.end();						// End the process
							}
								else if (orderAmount < 0) {				// If the order amount is negative
									console.log("That's a negative amount.  Please try again.");	// Try again
									startShopping();
								}
									else if (!Number.isInteger(orderAmount * 1)) {		// If it's a decimal
										console.log("That's a fractional amount.  Please try again.");
										startShopping();
									}
										else if (res[orderIndex].stock_quantity >= orderAmount) {	// If there is enough in stock
											var orderCost = res[orderIndex].price * parseInt(orderAmount); 	// Get the cost
											connection.query("UPDATE products SET ? WHERE ?",				// Update the table
												[
													{
														stock_quantity: res[orderIndex].stock_quantity - orderAmount
													},
													{
														item_id: orderID
													}
												], function (err, response) {
													if (err) throw err;
													console.log("That cost:  $" + orderCost.toFixed(2));		// Display total cost
													startShopping();								// And start over
												});
										}
											else {				// There isn't enough in stock
												console.log("There isn't enough in stock for that order.  Please try again.");
												startShopping();
											}
						});
					}
						else {							// The order ID wasn't in the list
							console.log("That choice was not found.  Please try again.");
							startShopping();
						}
				}
		});
	});
}