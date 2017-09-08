create database bamazon;

use bamazon;

create table products(
    item_id int auto_increment not null,
    product_name varchar(30) not null,
    department_name varchar(30) not null,
    price decimal(6,2) not null,
    stock_quantity int not null,
    product_sales int default 0,
    key(item_id)
);

insert into products(product_name, department_name, price, stock_quantity) VALUES ('ipad', 'electronics', 399.99,10),
('textbook', 'books', 199.99,20),
('shoes', 'apparel', 49.99,60),
('t-shirt', 'apparel', 19.99,200),
('macbook', 'electronics', 1399.99,5),
('notebook', 'office supply',9.99,300),
('USB Drive', 'electronics', 29.99,30),
('Winter Jacket', 'apparel', 149.99,20),
('Phone case', 'electronics', 24.99,50),
('backpack', 'office supply', 49.99,35);


-- departments table
create table departments(
	department_id int auto_increment not null,
	department_name varchar(30) not null,
	over_head_cost int(10) not null,
	key(department_id)
);

insert into departments(department_name, over_head_cost) values ('electronics', 10000), ('aparel', 7500), ('office supply', 4000)