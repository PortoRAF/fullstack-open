const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Router = require('express').Router()
const User = require('../models/user')

Router.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'incorrect username or password'
      })
    }

    const token = jwt.sign({ username, id: user._id }, process.env.SECRET)

    res.status(200).send({ username, name: user.name, token })
  } catch (error) {
    next(error)
  }
})

module.exports = Router
