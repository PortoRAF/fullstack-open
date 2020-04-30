const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

logger.info(`Connecting to ${config.MONGODB_SERVER}`)

mongoose.connect(config.MONGODB_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting to MongoDB', error))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
