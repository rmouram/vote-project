const express = require('express')
const routes = require('./routes')
const session = require('express-session')
const app = express()

const { engine } = require('express-edge')

app.use(express.json())
app.use(engine)
app.set('views', __dirname+'/views')
app.use(express.static('public'))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge  : new Date(Date.now() + 3600000), //1 Hour
        expires : new Date(Date.now() + 3600000), //1 Hour
    }
}))
app.use((request, response, next) => {
    if (request.session.user) {
        request.user = request.session.user
        response.user = request.session.user
    }
    next()
})
app.use(routes)

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})