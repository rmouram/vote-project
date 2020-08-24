const express = require('express')
const { request, response } = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')


const routes = express.Router()
routes.use(bodyParser.urlencoded({extended : true}))
routes.use(bodyParser.json())

//Sessão
routes.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

//Conexão com o banco (passar pro bd.js)
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'vote-project' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});


//Rotas ---------------------------------------------------------------------------------------------
//Home
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


//Login
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
		response.send(`Please enter Username and Password!`);
		response.end();
	}
});

//Cadastro
routes.post('/cadastro', function(request,response){
    var name = request.body.name
    var email = request.body.email
    var password = request.body.password
    con.query(`INSERT INTO users (name,email, hashed_password) VALUES('${name}','${email}','${password}')`, function(error, results, fields) {
        if(error!='null'){
           if(error.sqlMessage.substring(9,0)=='Duplicate'){

           }
        }
        
        
    })
    
})

//MeusVotos
routes.get('/index', function(request,response){
    if (request.session.loggedin){

       con.query('SELECT title FROM votes LIMIT 6',function(erro,results,fields){
            response.render('index', {
                name: results
            })
        })

    
    } else {
        return response.render('index', {
            name: 'Lindinho'
        })
    }
    response.end()

})


module.exports = routes