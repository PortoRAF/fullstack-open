const bcrypt = require('bcrypt')
const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    date: new Date(),
  },
  {
    content: 'Browser can execute only Javascript',
    important: true,
    date: new Date(),
  }
]

const nonExistingId = async () => {
  const note = new Note({
    content: 'willremovethissoon',
    date: new Date()
  })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => JSON.parse(JSON.stringify(note.toJSON())))
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })
  await user.save()
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  createUser
}
