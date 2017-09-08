(function(){

    var inquirer = require('inquirer');
    var mysql = require('mysql');
    var Table = require('easy-table')
    var tableView = new Table;
    
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '', //this may need to changed depending on what computer i'm using
        database: 'bamazon'
    });
    
    var productId;
    var reduceQty;
    var qtyCheck;
    var price;
    
    /* shows all inventory before allowing customer to select from it */
    connection.query(
        'select * from products',
        function(err, results, fields){
            for(var i = 0; i < results.length; i++){
                //formats the data to look better in console using 'easy-table'
                tableView.cell('ITEM ID',results[i].item_id);
                tableView.cell('PRODUCT NAME',results[i].product_name);
                tableView.cell('$ PRICE',results[i].price);
                tableView.newRow();
            }
            console.log(tableView.toString());
            userPrompt();
        }
    );
    

    function userPrompt(){
        inquirer.prompt([
            {
                name:'product_id',
                message: 'What product would you like to buy? (Type Item\'s ID # to select)'
            },
            {
                name:'buy_amt',
                message: 'How many would you like to buy?'
            }
        ]).then(function(item_answer){
            productId = item_answer.product_id;
            reduceQty = item_answer.buy_amt;
            
            itemQuery(); //calls itemQuery Function 
        })
        
    }


    
    /* RETRIEVES THE QTY AND DETERMINES IF THERE IS ENOUGH TO BE PURCHASED */
    function itemQuery(){
        connection.query(
            'select stock_quantity, price from products where item_id = ?', [productId], function(err,results){
                //resulting qty from db
                qtyCheck = results[0].stock_quantity;
                //stores price from query to be used with the total calc
                price = results[0].price 
                if(qtyCheck < reduceQty){
                    console.log('Insufficient Quantity!');
                    connection.end();
                } else {
                    updateQty();
                    completeOrder(price, reduceQty) 
                }
            }
        )
    }
   
    /* UPDATED THE QUANTITY IN THE DB */
    function updateQty(){
        connection.query(
            'update products set stock_quantity = stock_quantity - ? where item_id = ?', [reduceQty, productId], function(err,results, fields){
                if(err) throw err;
            }
        )
    }

    /* CALCULATE THE TOTAL AMOUNT AND DISPLAYS IT */
    function completeOrder(price, reduceQty){
        var total = price * reduceQty
        updateProductSales(total);
        console.log('Order Complete! Your total is: $' + parseFloat(total))
    }

    /* Update the product sales for each product bought */
    function updateProductSales(total){
        connection.query(
            'update products set product_sales = product_sales + ? where item_id = ?', [total, productId], function(err,results){
                if(err) throw err;
            }
        )
        connection.end();
    }

    



})();//end of iife 


