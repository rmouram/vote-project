const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'project-vote' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

module.exports = {
  async findLatest(){
    con.query('SELECT * FROM votes', function (erro,results,fields){
      return results
    })
  }
}