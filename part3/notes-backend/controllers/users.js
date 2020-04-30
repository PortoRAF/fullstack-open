const bcrypt = require('bcrypt')
const Router = require('express').Router()
const User = require('../models/user')

Router.get('/', async (req, res, next) => {
  const users = await User
    .find({})
    .populate('notes', {
      content: 1,
      date: 1
    })
  res.json(users)
})

Router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = Router
