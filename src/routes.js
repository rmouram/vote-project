const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const connection = require('./database/connections')

const userController = require('./controllers/UserController')
const voteController = require('./controllers/VoteController')
const myVoteController = require('./controllers/MyVoteController')
const sessionController = require('./controllers/SessionController')
const { request, response } = require('express')


const routes = express.Router()
routes.use(express.urlencoded({
    extended: true
  }))


routes.get('/', voteController.index)
routes.get('/meus-votos', myVoteController.index)
routes.get('/criar-votacao', (request, response) => {
    return response.render('cadastrar-vote', {
        user: request.user
    })
})
routes.get('/editar-voto/:id', async (request, response) => {
    const { id } = request.params
    const vote = await connection('votes').select().where({id}).first()
    const opts = await connection('votes_options').select().where({vote_id: vote.id})
    return response.render('editar-voto', {
        user: request.user,
        vote: {
            ...vote,
            opts
        }
    })
})

routes.post('/vote', voteController.create)
routes.post('/vote/editar/:id', voteController.update)
routes.get('/vote/delete/:id', voteController.delete)

routes.get('/login', (request, response) => {
    return response.render('login')
})
routes.get('/logout', sessionController.lougout)
routes.post('/auth', sessionController.create)

routes.get('/cadastro', (request, response) => {
    return response.render('cadastro')
})
routes.post('/cadastro', userController.create)

routes.get('/single-vote/:vote_id', voteController.show)
routes.post('/votar/:vote_id', myVoteController.update)
routes.get('/votar/:vote_id', myVoteController.show)
//routes.get('/result', myVoteController.show)

module.exports = routes