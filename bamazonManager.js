(function(){
    var inquirer = require('inquirer');
    var mysql = require('mysql');
    var Table = require('easy-table')
    var tableView = new Table;
    
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '', //this may need to changed depending on what computer i'm using. MAMP need 'root' for pw
        database: 'bamazon'
    });

    var productId;
    var addQty;
    var closeConnection = true; //need this in order for viewItems() to work with updateQty()


    /* CONSTRUCTOR FOR ADDING NEW PRODUCT TO DB */
    function NewProduct(prodName, deptName, price, stockQuantity ){
        this.prodName = prodName;
        this.deptName = deptName;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.addProduct = function(){
            connection.query(
                'insert into products (product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)',[this.prodName, this.deptName,this.price, this.stockQuantity], function(err){
                    if(err) throw err;
                    console.log('Added to products!')
                }
            )
            connection.end();
        }
    }
    
  
    function main(){
        inquirer.prompt([
            {
                name:'list_menu',
                type: 'list',
                message: 'Welcome Manager!\nSelect menu item: ',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
            }
        ]).then(function(selector){
    
            if(selector.list_menu === 'View Products for Sale'){
                viewItems();
            } 
            else if(selector.list_menu === 'View Low Inventory'){
                lowInventory();
            }
            else if (selector.list_menu === 'Add to Inventory'){
                closeConnection = false;
                viewItems()
                //needed to set timeout otherwise the items get called later than the prompt
                setTimeout(function(){
                    inquirer.prompt([
                       {
                           name:'select_inventory',
                           message:'Type Item ID # to add inventory to:'
                       },
                       {
                           name:'add_inventory',
                           message: 'Enter Quantity of selected product:'
                       }
                     ]).then(function(qtyCheck){
                       productId = qtyCheck.select_inventory;
                       addQty = qtyCheck.add_inventory;
                       updateQty();
                       
                    })
                },500) 
            } 
            else if (selector.list_menu === 'Add New Product'){
                console.log('Add you new Product\n======================\n')
                inquirer.prompt([
                    {
                        name: 'addName',
                        message: 'Products Name:'
                    },
                    {
                        name:'addDept',
                        message: 'Product Department'
                    },
                    {
                        name:'addPrice',
                        message:'New Products Price'
                    },
                    {
                        name: 'addQty',
                        message: 'Products Starting Inventory'
                    }
                ]).then(function(newProd){
                    var addNewProd = new NewProduct(newProd.addName, newProd.addDept, newProd.addPrice, newProd.addQty);
                    addNewProd.addProduct();
                })
            }
    
        })

    }


    /* VIEWS ALL ITEMS AND INFO ABOUT PRODUCTS */
    function viewItems(){
        connection.query(
            'select * from products', function(err, results){
                for(var i =0; i<results.length; i++){
                    tableView.cell('Item ID',results[i].item_id);
                    tableView.cell('Product',results[i].product_name);
                    tableView.cell('Department',results[i].department_name);
                    tableView.cell('Price',results[i].price);
                    tableView.cell('QTY on Hand',results[i].stock_quantity);
                    tableView.newRow();

                }
                console.log(tableView.toString())
            }
        )
        if (closeConnection){
            connection.end();
        }
    }


    /* CHECKS TO SEE IF INVENTORY IS LOW */
    function lowInventory(){
        connection.query(
            'select * from products where stock_quantity < 5',function(err, results){
                if(err) throw err;
                if(results.length === 0){
                    console.log('\n************\nAll inventories are good. No low inventory\n************')
                } else {
                    for(var i =0; i<results.length; i++){
                        tableView.cell('Item ID',results[i].item_id);
                        tableView.cell('Product',results[i].product_name);
                        tableView.cell('Department',results[i].department_name);
                        tableView.cell('Price',results[i].price);
                        tableView.cell('QTY on Hand',results[i].stock_quantity);
                        tableView.newRow();
                    }
                    console.log(tableView.toString())
                }
            }
        )
        connection.end();
    }



    function updateQty(){
        connection.query(
            'update products set stock_quantity = stock_quantity + ? where item_id = ?', [addQty, productId], function(err,results, fields){
                if(err) throw err;
                console.log('Quantities have been updated' )
            }
        )
        connection.end();
        closeConnection = true;
    }




    main();
})();//end of program