const express = require('express')
const mongoose = require('mongoose')
const router = require('./auth-routes')
const app = express()
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./authMiddleWare')

// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

// database connection
// const dbURI = 'mongodb+srv://tiger:tiger@clusterstar-8a6z8.mongodb.net/jwt'
const dbURI = 'mongodb://localhost/jwt'
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(result => app.listen(8000, () => console.log('server running')))
  .catch(err => console.log(err))

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(router)
