const express = require('express')
const routes = require('./routes')

const app = express()

const { engine } = require('express-edge')

app.use(express.json())
app.use(engine)
app.set('views', __dirname+'/views')
app.use(express.static('public'))
app.use(routes)

app.listen(3000, () => {
    console.log('Server is running')
})