require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_SERVER = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_SERVER
  : process.env.MONGODB_SERVER

module.exports = {
  PORT,
  MONGODB_SERVER
}