const express = require('express')
const { request, response, query } = require('express')
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
const { get } = require('http')
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


//Logout
routes.get('/logout', function(request, response) {

	request.session.loggedin = false
		
	response.end();
})

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

//Enquetes Públicas - As votações salvas no banco
routes.get('/index', function(request,response){
 
    con.query('SELECT title FROM votes LIMIT 6',function(erro,results,fields){
            return results
            })
    response.end()
})

//Meus Votos - Votos criados pelo usuário (apenas listagem dos titulos)
routes.get('/meusvotos', function(request,response){
    if(request.session.loggedin){
        //Titulo das votações
        con.query('SELECT title FROM votes WHERE userID=(SELECT id FROM users WHERE name=?)', request.session.name ,function(erro,results,fields){
                console.log(results)
                })
        //Opções das votações
        con.query('SELECT title FROM votes WHERE userID=(SELECT id FROM users WHERE name=?)', request.session.name ,function(erro,results,fields){
            console.log(results)
            })
    }

    response.end()
})
//Opções das votações
routes.get('/meusvotos/:votetitle', function(request,response){
    var vote_title = request.params.votetitle
    if(request.session.loggedin){
        con.query(`SELECT option_vote FROM vote_options WHERE voteID = (SELECT voteID FROM votes WHERE title='${vote_title}?')`,function(erro,results,fields){
            console.log(results)
            })
    }

    response.end()
})

//Resultado das votações
routes.get('/meusvotos/:votetitle/results', function(request,response){
    var vote_title = request.params.votetitle
    if(request.session.loggedin){
        con.query(`SELECT option_vote,num_votes FROM vote_options WHERE voteID = (SELECT voteID FROM votes WHERE title='${vote_title}?')`,function(erro,results,fields){
            console.log(results)
            })
    }

    response.end()
})

//Votar
routes.post('/vote-single', function(request,response){
    var vote_title = request.body.vote_title
    var option_vote = request.body.option_vote

    con.query(`UPDATE vote_options SET num_votes = num_votes+1 WHERE option_vote='${option_vote}' AND voteID=(SELECT voteID FROM votes WHERE title='${vote_title}?')`, function(error, results, fields) {
    })
    
})



module.exports = routes