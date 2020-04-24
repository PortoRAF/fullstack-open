require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_SERVER = process.env.MONGODB_SERVER

module.exports = {
  PORT,
  MONGODB_SERVER
}