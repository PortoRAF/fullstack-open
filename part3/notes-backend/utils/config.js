require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_SERVER = process.env.MONGODB_SERVER

if (process.env.NODE_ENV === 'test') {
  MONGODB_SERVER = process.env.TEST_MONGODB_SERVER
}

module.exports = {
  MONGODB_SERVER,
  PORT
}