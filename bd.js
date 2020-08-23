const mysql = require('mysql');

function execSQLquery (sqlQry, res){
    const con = mysql.createConnection({
        host: 'localhost', // O host do banco. Ex: localhost
        user: 'root', // Um usuário do banco. Ex: user 
        password: '', // A senha do usuário. Ex: user123
        database: 'users' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
    });

    con.query(sqlQry, (err, results, fields)=>{
        if(err)
            res.json(err)
        else
            res.json(results)
            con.end()
    })
}
