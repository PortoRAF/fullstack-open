require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_SERVER = process.env.MONGODB_SERVER

module.exports = {
  MONGODB_SERVER,
  PORT
}