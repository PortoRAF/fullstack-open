const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const blogUrl = ('/api/blogs')
const userUrl = ('/api/users')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.initialBlogs) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

describe('already existing blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get(blogUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get(blogUrl)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog post is named id', async () => {
    const response = await api.get(blogUrl)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('insertions of blogs in database', () => {
  test('successfully creates a new blog post', async () => {
    const newBlog = new Blog({
      title: 'Test sample blog',
      author: 'Test author\'s name',
      url: 'https://www.testlink.com',
      likes: 1
    })

    await api
      .post(blogUrl)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get(blogUrl)
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.body[2]
    expect(contents.title).toContain(newBlog.title)
  })

  test('when \'likes\' property is missing it defaults to zero', async () => {
    const newBlog = new Blog({
      title: 'Test sample blog',
      author: 'Test author\'s name',
      url: 'https://www.testlink.com'
    })

    await api
      .post(blogUrl)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get(blogUrl)
    expect(blogsAtEnd.body[2].likes).toBe(0)
  })

  test('blogs must have title and author properties', async () => {
    const noTitle = new Blog({
      author: 'Test author\'s name',
      url: 'https://www.testlink.com'
    })

    const noAuthor = new Blog({
      title: 'Test sample blog',
      url: 'https://www.testlink.com'
    })

    await api
      .post(blogUrl)
      .send(noTitle)
      .expect(400)

    await api
      .post(blogUrl)
      .send(noAuthor)
      .expect(400)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogs = await api.get(blogUrl)
    const blogToUpdateId = blogs.body[0].id

    const updatedBlog = await api
      .put(`${blogUrl}/${blogToUpdateId}`)
      .send({ likes: 100 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toBe(100)
  })

  test('fails and returns status code 400 if properties author and title are empty', async () => {
    const blogs = await api.get(blogUrl)
    const blogToUpdateId = blogs.body[0].id

    const noTitle = new Blog({ title: '' })
    const noAuthor = new Blog({ author: '' })

    await api
      .put(`${blogUrl}/${blogToUpdateId}`)
      .send(noTitle)
      .expect(400)

    await api
      .put(`${blogUrl}/${blogToUpdateId}`)
      .send(noAuthor)
      .expect(400)
  })

  test('fails and returns status code 404 if id is valid but does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .put(`${blogUrl}/${nonExistingId}`)
      .expect(404)
  })

  test('fails and returns status code 400 if id is invalid', async () => {
    const invalidId = 555

    await api
      .put(`${blogUrl}/${invalidId}`)
      .expect(400)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 when id is valid', async () => {
    const blogs = await api.get(blogUrl)
    const blogToDeleteId = blogs.body[0].id

    await api
      .delete(`${blogUrl}/${blogToDeleteId}`)
      .expect(204)

    const blogsAtEnd = await api.get(blogUrl)
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('creating user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('with another user already in db', async () => {
    const user = {
      name: 'Kai B Rich',
      username: 'KRich',
      password: 'strong'
    }

    const newUser = await api
      .post(userUrl)
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(newUser.body.username).toEqual(user.username)
  })

  test('with an already taken username should fail', async () => {
    const user = {
      username: 'root',
      password: 'sekret'
    }

    await api
      .post(userUrl)
      .send(user)
      .expect(400)
  })

  test('with invalid username and password should fail', async () => {
    const invalidUsername = {
      username: 'rt',
      password: 'sekret'
    }

    const invalidPassword = {
      username: 'userName',
      password: 'st'
    }

    await api
      .post(userUrl)
      .send(invalidUsername)
      .expect(400)

    await api
      .post(userUrl)
      .send(invalidPassword)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
