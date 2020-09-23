const jwt = require('jsonwebtoken')
const User = require('./user')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'abc', (err, decodedToken) => {
      if (err) {
        res.redirect('/signin')
      } else {
        next()
      }
      // console.log(decodedToken)
    })
  } else {
    res.redirect('/signin')
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, 'abc', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        next()
      } else {
        const user = await User.findById(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}
module.exports = { requireAuth, checkUser }
