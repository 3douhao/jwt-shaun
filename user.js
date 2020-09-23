const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'please enter valid email address']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'minimum character is 6']
  }
})

schema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('wrong password')
  }
  throw Error('wrong email address')
}

const User = mongoose.model('user', schema)
module.exports = User
