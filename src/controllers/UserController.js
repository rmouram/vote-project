/* const mysql = require('mysql');
const { get } = require('http');
const { create } = require('domain');
const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'project-vote' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
}); */

const connection = require('../database/connections')

module.exports = {
  async index(request, response){
    const results = await connection('users')
    return response.json(results)
  },
  async create(request, response){
    const { name, email, password, password_confirm } = request.body

    if (password != password_confirm) {
      //
      return response.redirect('/cadastro', { notification: 'As senhas não batem' })

    }

    await connection('users').insert({
      name,
      email,
      password
    })
    return response.redirect('/login')
  },
  async update(request, response){
    const { name } = request.body
    const { id } = request.params

    await connection('users')
    .where({id})
    .update({name})

    return response.send()

  },
  async delete(request, response){

  },
  async show(request, response){

  }
}