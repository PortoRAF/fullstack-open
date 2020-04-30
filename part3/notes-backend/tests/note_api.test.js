const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Note = require('../models/note')

const notesUrl = '/api/notes'
const usersUrl = '/api/users'
const loginUrl = '/api/login'

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of helper.initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get(notesUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get(notesUrl)

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get(notesUrl)

    const contents = response.body.map(r => r.content)

    expect(contents).toContain('Browser can execute only Javascript')
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`${notesUrl}/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with status code 404 if note does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .get(`${notesUrl}/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 555

    await api
      .get(`${notesUrl}/${invalidId}`)
      .expect(400)
  })
})

const validToken = async (username, password) => {
  const user = { username, password }
  const loggedIn = await api
    .post(loginUrl)
    .send(user)

  return loggedIn.body.token
}

describe('addition of a new note', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.createUser('HCopter', 'sekret')
  })

  test('succeeds with valid data', async () => {
    const token = await validToken('HCopter', 'sekret')

    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true
    }

    await api
      .post(notesUrl)
      .set('Authorization', `bearer ${token}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(newNote.content)
  })

  test('fails with status code 400 if data is invalid', async () => {
    const token = await validToken('HCopter', 'sekret')

    const newNote = {
      important: true
    }

    await api
      .post(notesUrl)
      .set('Authorization', `bearer ${token}`)
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })

  test('fails with status code 401 if token is invalid or missing', async () => {
    const token = await validToken('HCopter', 'sekret')

    const newNote = {
      content: 'users need valid token to authenticate',
      important: true
    }

    await api.post(notesUrl)
      .set('Authorization', `bearer ${''}`)
      .send(newNote)
      .expect(401)

    await api.post(notesUrl)
      .set('Authorization', `bearer ${token.substring(10)}`)
      .send(newNote)
      .expect(401)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`${notesUrl}/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(notesAtStart.length - 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post(usersUrl)
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails to create if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'salainen'
    }

    const result = await api
      .post(usersUrl)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('user login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'HCopter', passwordHash })

    await user.save()
  })

  test('succeeds with valid username/password and generates auth token', async () => {
    const user = {
      username: 'HCopter',
      password: 'sekret'
    }

    const loggedIn = await api
      .post(loginUrl)
      .send(user)
      .expect(200)

    expect(loggedIn.body.username).toEqual(user.username)
    expect(loggedIn.body).toHaveProperty('token')
  })

  test('fails with invalid username', async () => {
    const user = {
      username: 'NotRegistered',
      password: 'sekret'
    }

    await api
      .post(loginUrl)
      .send(user)
      .expect(401)
  })

  test('fails with invalid password for existing user', async () => {
    const user = {
      username: 'HCopter',
      password: 'WrongPassword'
    }

    await api
      .post(loginUrl)
      .send(user)
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
