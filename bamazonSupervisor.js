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

    //Make sure there are no "" in the aliases!
    var queryOptions ={
        sql:'SELECT d.department_id, d.department_name, ' +
            'sum(d.over_head_cost) AS Over_Head_Costs ,'+
            'SUM(p.product_sales) AS Product_Sales ,'+
            'SUM(p.product_sales-d.over_head_cost) AS Total_Profit '+
            'FROM departments d '+
            'INNER JOIN products p '+
            'ON d.department_name = p.department_name '+
            'GROUP BY d.department_id, d.department_name;',
        nestTables: '_'
        }

    function CreateDepartment(deptName, costs){
        this.deptName = deptName;
        this.costs = costs;
        this.addDept = function(){
            connection.query(
                'insert into departments (department_name, over_head_cost) values (?,?)',[this.deptName, this.costs],
                function(err,results){
                    if(err) throw err;
                }
            )
            connection.end();
        }
    }

    function main(){
        inquirer.prompt([
            {
                type: 'list',
                name:'supervisor_menu',
                message: 'Please choose an option:',
                choices: ['View Product Sales by Department', 'Create new Department']
            }
        ]).then(function(choice){
            if (choice.supervisor_menu === 'View Product Sales by Department'){
                connection.query(queryOptions,function(err,results){
                    // var queryResults = JSON.parse(results);
                    for(var i = 0; i<results.length; i++){
                        tableView.cell('Department ID',results[i].d_department_id);
                        tableView.cell('Department Name', results[i].d_department_name);
                        tableView.cell('Overhead Costs', results[i]._Over_Head_Costs);
                        tableView.cell('Product Sales',results[i]._Product_Sales);
                        tableView.cell('Total Profit', results[i]._Total_Profit);
                        tableView.newRow();
                    }
                    console.log(tableView.toString())
                })
                connection.end();
            }
            else if(choice.supervisor_menu === 'Create new Department'){
                inquirer.prompt([
                    {
                        name: 'dept_name',
                        message: 'Enter name of dept: '
                    },
                    {
                        name: 'costs',
                        message: 'What is the overhead cost? '
                    }
                ]).then(function(answer){
                    var newDept = new CreateDepartment(answer.dept_name, answer.costs)
                    newDept.addDept();
                })
            }
        })
    }    
    main();

 })();