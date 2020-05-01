const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path  :', req.path)
  logger.info('Body  :', req.body)
  logger.info()
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'bad formatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'failed to authenticate user' })
  }

  next(error)
}

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decoded.id)

    if (!user || !token || !decoded.id) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).send({ error: 'token missing or invalid' })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  auth
}
