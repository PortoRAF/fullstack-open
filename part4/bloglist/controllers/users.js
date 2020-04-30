const bcrypt = require('bcrypt')
const Router = require('express').Router()
const User = require('../models/user')

Router.get('/', async (req, res, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', {
        url: 1,
        title: 1,
        author: 1,
        id: 1
      })

    res.json(users)
  } catch (error) {
    next(error)
  }
})

Router.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body

    if (password.length < 3) {
      return res.status(400).json({
        error: 'password is shorter than minimum allowed length (3)'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      name,
      username,
      passwordHash
    })

    const user = await newUser.save()

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = Router
