const mysql = require('mysql');
const { get } = require('http');
const { create } = require('domain');
const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'project-vote' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

module.exports = {
  async index(request, response){
    con.query('SELECT title FROM votes LIMIT 6',function(erro,results,fields){
      return response.render('index', {user: request.user, votes: results})
    })
  },
  async create(request, response){
    
  },
  async update(request, response){

  },
  async delete(request, response){

  },
  async show(request, response){

  }
}