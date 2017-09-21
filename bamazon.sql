DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) DEFAULT 0.00,
	stock_quantity INT DEFAULT 0,
	PRIMARY KEY (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Blu-Ray Player", "Electronics", 195.00, 20);

insert into products (product_name, department_name, price, stock_quantity)
values ("500 GB DVR", "Electronics", 179.99, 30);

insert into products (product_name, department_name, price, stock_quantity)
values ("Universal Remote", "Electronics", 41.88, 53);

insert into products (product_name, department_name, price, stock_quantity)
values ("Stand Mixer", "Kitchen Small Appliances", 345.00, 17);

insert into products (product_name, department_name, price, stock_quantity)
values ("Sous Vide", "Kitchen Small Appliances", 179.00, 6);

insert into products (product_name, department_name, price, stock_quantity)
values ("In Room Brewing System", "Kitchen Small Appliances", 89.99, 83);

insert into products (product_name, department_name, price, stock_quantity)
values ("Cast Iron Combo Cooker", "Cookware and Baking Pans", 31.80, 25);

insert into products (product_name, department_name, price, stock_quantity)
values ("16-Inch Rectangular Roaster with Rack", "Cookware and Baking Pans", 66.42, 74);

insert into products (product_name, department_name, price, stock_quantity)
values ("Marble Run Super Set", "Toys and Games", 39.99, 63);

insert into products (product_name, department_name, price, stock_quantity)
values ("60-Piece Gear Wheel, Axle and Stopper Set", "Electronics", 28.99, 37);

insert into products (product_name, department_name, price, stock_quantity)
values ("20-inch Expandable Carry-On", "Luggage", 49.99, 44);

select * from products;