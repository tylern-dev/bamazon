var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('easy-table')
var tableView = new Table;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root', //this may need to changed depending on what computer i'm using
    database: 'bamazon'
});

// connection.connect(function(err){
//     if(err) throw err;
//     console.log('connected as id: '+connection.threadId);
//     connection.end();
// })

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
        connection.end();
        userPrompt();
    }
    
);

function userPrompt(){
    inquirer.prompt([
        {
            name:'product_id',
            message: 'What product would you like to buy? (Type Item\'s ID # to select)'
        }
    ]).then(function(answer){
        //code
    })

}



