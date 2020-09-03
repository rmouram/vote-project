const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const userController = require('./controllers/UserController')
const voteController = require('./controllers/VoteController')
const sessionController = require('./controllers/SessionController')
const { request, response } = require('express')


const routes = express.Router()
routes.use(express.urlencoded({
    extended: true
  }))


routes.get('/', voteController.index)
routes.get('/login', (request, response) => {
    return response.render('login')
})
routes.get('/logout', sessionController.lougout)
routes.post('/auth', sessionController.create)

routes.get('/cadastro', (request, response) => {
    return response.render('cadastro')
})
routes.post('/cadastro', userController.create)

module.exports = routes