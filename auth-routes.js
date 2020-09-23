const { Router } = require('express')
const User = require('./user')
const jwt = require('jsonwebtoken')

const router = Router()

const handleErrors = error => {
  const errors = { email: '', password: '' }

  if (error.message === 'wrong email address') {
    errors.email = 'Please input correct email'
  }
  if (error.message === 'wrong password') {
    errors.password = 'Please input correct password'
  }
  if (error.code === 11000) {
    errors.email = 'this email is already in database'
    return errors
  }

  if (error.message.includes('user validation failed')) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}

const maxAge = 3 * 24 * 60 * 60
const setToken = id => {
  return jwt.sign({ id }, 'abc', { expiresIn: maxAge })
}

router.get('/signup', (req, res) => res.render('signup.ejs'))
router.get('/signin', (req, res) => res.render('signin.ejs'))
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.create({ email, password })
    const token = setToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).send({ user: user._id })
  } catch (e) {
    const errors = handleErrors(e)
    res.send({ errors })
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = setToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, expiresIn: maxAge * 1000 })
    res.send({ user: user._id })
  } catch (e) {
    const errors = handleErrors(e)
    res.send({ errors })
  }
})

router.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
})

module.exports = router
