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
	manageInventory();
});

function manageInventory() {
	inquirer.prompt([
		{
			type: "list",
			name: "command",
			message: "What would you like to do?",
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Update Price",
				"Add New Product",
				"Delete Product",
				"Quit"
			]
		}
	]).then(function(answers){
		switch (answers.command) {
			case "Quit":
				connection.end();
				break;

			case "View Products for Sale":
				connection.query("SELECT * FROM products", function(err, res) {
					if (err) throw err;
					// Log all results of the SELECT statement
					console.log("\n");
					console.table(res);
					manageInventory();
				});
				break;

			case "View Low Inventory":
				lowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Update Price":
				updatePrice();
				break;

			case "Add New Product":
				inquirer.prompt([
					{
						type: "input",
						name: "itemName",
						message: "What is the name of the item?"
					},
					{
						type: "input",
						name: "itemDept",
						message: "In which department is this item?"
					},
					{
						type: "input",
						name: "itemPrice",
						message: "How much does this item cost?"
					},
					{
						type: "input",
						name: "itemStock",
						message: "How many is there in stock?"
					}
				]).then(function(answers) {
					createItem(answers.itemName, answers.itemDept, answers.itemPrice, answers.itemStock);
				});
				break;

			case "Delete Product":
				deleteItem();
				break;
		}
	});
}


// VIEW low inventory

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 6", function(err, res) {
		if (err) throw err;
		// Log all results of the SELECT statement
		if (res.length === 0) {
			console.log("\nAll items have at least 5 in stock.\n");
			manageInventory();
		}
			else {
				console.log("\nThese items are running low on stock:\n");
				console.table(res);
				manageInventory();
			}
	});
}



// ADD inventory
function addInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// Log all results of the SELECT statement
		console.log("\n");
		console.table(res);
		inquirer.prompt([
			{
				type: "input",
				name: "itemNum",
				message: "Which item needs new stock?"
			}
		]).then(function(answers) {
			var orderID = answers.itemNum;
			var idArray = [];									// Get an array of the IDs in case an item was deleted
			for (var i = 0; i < res.length; i++) {
				idArray.push(res[i].item_id);
			}
			if (idArray.indexOf(parseInt(orderID)) !== -1) {	// If the orderID is in the list
				inquirer.prompt([
					{
						type: "input",
						name: "amount",
						message: "How many items are to be added?"
					}
				]).then (function(answers) {
					var addAmount = answers.amount;	// Set up the amount for the order that can survive scope
					if (addAmount < 0) {				// If the order amount is negative
						console.log("That's a negative amount.  Please try again.");	// Try again
						addInventory();
					}
						else if (!Number.isInteger(addAmount * 1)) {		// If it's a decimal
							console.log("That's a fractional amount.  Please try again.");
							addInventory();
						}
							else {
								var orderIndex = idArray.indexOf(parseInt(orderID));
								var newStock = res[orderIndex].stock_quantity + parseInt(addAmount);
								var itemName = res[orderIndex].product_name;
								connection.query("UPDATE products SET ? WHERE ?",				// Update the table
									[
										{
											stock_quantity: newStock
										},
										{
											item_id: orderID
										}
									], function (err, response) {
										if (err) throw err;
										console.log("\n" + itemName, "now has", newStock + "\n");		// Display total cost
										manageInventory();								// And start over
									});
							}
				});
			}
				else {							// The order ID wasn't in the list
					console.log("\nThat choice was not found.  Please try again.");
					addInventory();
				}
		});
	});
}


// UPDATE price
function updatePrice() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// Log all results of the SELECT statement
		console.log("\n");
		console.table(res);
		inquirer.prompt([
			{
				type: "input",
				name: "itemNum",
				message: "Which item needs a new price?"
			}
		]).then(function(answers) {
			var orderID = answers.itemNum;
			var idArray = [];									// Get an array of the IDs in case an item was deleted
			for (var i = 0; i < res.length; i++) {
				idArray.push(res[i].item_id);
			}
			if (idArray.indexOf(parseInt(orderID)) !== -1) {	// If the orderID is in the list
				inquirer.prompt([
					{
						type: "input",
						name: "amount",
						message: "What is the new price?"
					}
				]).then (function(answers) {
					var newPrice = answers.amount;	// Set up the amount for the order that can survive scope
					if (newPrice < 0) {				// If the order amount is negative
						console.log("That's a negative amount.  Please try again.");	// Try again
						updatePrice();
					}
						else {
							var orderIndex = idArray.indexOf(parseInt(orderID));
							var itemName = res[orderIndex].product_name;
							connection.query("UPDATE products SET ? WHERE ?",				// Update the table
								[
									{
										price: parseFloat(newPrice).toFixed(2)
									},
									{
										item_id: orderID
									}
								], function (err, response) {
									if (err) throw err;
									console.log("\n" + itemName, "now costs $" + parseFloat(newPrice).toFixed(2) + "\n");		// Display total cost
									manageInventory();								// And start over
								});
						}
				});
			}
				else {							// The order ID wasn't in the list
					console.log("\nThat choice was not found.  Please try again.");
					updatePrice();
				}
		});
	});
}


// CREATE item
function createItem(itemName, itemDept, itemPrice, itemStock) {
	connection.query(
		"INSERT INTO products SET ?",
		{
			product_name: itemName,
			department_name: itemDept,
			price: itemPrice,
			stock_quantity: itemStock
		},
		function(err, res) {
			console.log("\n" + itemName,  "has been inserted!\n");
			manageInventory();
		}
	);
}



// DELETE item 
function deleteItem() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		// Log all results of the SELECT statement
		console.log("\n");
		console.table(res);
		inquirer.prompt([
			{
				type: "input",
				name: "itemNum",
				message: "Which item needs to be deleted?"
			}
		]).then(function(answers) {
			var orderID = answers.itemNum;
			var idArray = [];									// Get an array of the IDs in case an item was deleted
			for (var i = 0; i < res.length; i++) {
				idArray.push(res[i].item_id);
			}
			if (idArray.indexOf(parseInt(orderID)) !== -1) {	// If the orderID is in the list
				var orderIndex = idArray.indexOf(parseInt(orderID));
				var itemName = res[orderIndex].product_name;
				connection.query("DELETE FROM products WHERE ?",				// Delete the item
					[
						{
							item_id: orderID
						}
					], function (err, response) {
						if (err) throw err;
						console.log("\n" + itemName, "has been deleted.\n");
						manageInventory();								// And start over
					});
			}
				else {							// The order ID wasn't in the list
					console.log("\nThat choice was not found.  Please try again.");
					deleteItem();
				}
		});
	});
}
