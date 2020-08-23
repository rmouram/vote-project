const express = require('express')
const { request, response } = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const routes = express.Router()

routes.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

routes.use(bodyParser.urlencoded({extended : true}))
routes.use(bodyParser.json())

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'users' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

routes.get('/', (request, response) => {
    if (request.session.loggedin){
        const name = request.session.name
        return response.render('index', {
            name: name
        })
    } else {
        return response.render('index', {
            name: 'Lindinho'
        })
    }
    response.end()

})

routes.get('/login', (request, response) => {
    
    return response.render('login')
})

routes.post('/login', function(request, response) {
	var email = request.body.email
	var password = request.body.password
	if (email && password) {
		con.query('SELECT * FROM users WHERE email = ? AND hashed_password = ?', [email, password], function(error, results, fields) {
            if (results.length > 0) {
				request.session.loggedin = true
                request.session.name = results[0].name
                response.redirect('/');
                
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

routes.get('/users/:id?', (request, response)=>{
    //execSQLquery('SELECT * FROM users', response)
    let filter = ''
    if(request.params.id) filter = 'WHERE id=' + parseInt(request.params.id)
    execSQLquery('SELECT * FROM users '+filter, response)
})

routes.get('/votes', (request, response)=>{
		con.query('SELECT * FROM users', function(error, results, fields) {
            if (results.length > 0) {
                response.send(results)
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
})

module.exports = routes