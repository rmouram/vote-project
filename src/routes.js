const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const userController = require('./controllers/UserController')
const voteController = require('./controllers/VoteController')
const sessionController = require('./controllers/SessionController')


const routes = express.Router()
routes.use(bodyParser.urlencoded({extended : true}))
routes.use(bodyParser.json())

//Sessão
routes.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

function middlewareUserAutenticate(request, response, next){
    if(request.session.loggedin){
        const name = request.session.name
        request.user = { name }
    }

    next()
}
//Rotas ---------------------------------------------------------------------------------------------
//Home
routes.get('/', (request, response) => {
    
    return response.render('index')
})


//Login
routes.get('/login', (request, response) => {
    
    return response.render('login')
})

routes.post('/login', sessionController.create);


//Logout
routes.get('/logout', function(request, response) {

	request.session.loggedin = false
		
	response.redirect('/');
})

//Cadastrar usuário
routes.post('/signup', userController.create)

//lista usuários cadastrados
routes.get('/users', userController.index)

//alterar usuario (nao funciona)
routes.put('/users', userController.update)

//lista votações criadas
routes.get('/votes', voteController.index)

//Meus Votos - Votos criados pelo usuário (apenas listagem dos titulos)
routes.get('/meusvotos', function(request,response){
    if(request.session.loggedin){
        //Titulo das votações
        let res
        con.query('SELECT title FROM votes WHERE userID=(SELECT id FROM users WHERE name=?)', request.session.name ,function(erro,results,fields){
            res = reslt    
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