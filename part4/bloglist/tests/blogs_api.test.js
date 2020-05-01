const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const blogUrl = ('/api/blogs')
const userUrl = ('/api/users')
const loginUrl = ('/api/login')

const getToken = async (username, password) => {
  const user = await api
    .post(loginUrl)
    .send({ username, password })

  return user.body.token
}

const getUserBlogs = async (token) => {
  const blogs = await api
    .get(blogUrl)
    .set('Authorization', `Bearer ${token}`)

  return blogs.body
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = await helper.createUser('root', 'sekret')

  for (const blog of helper.initialBlogs) {
    const newBlog = new Blog({ ...blog, user: user._id })
    await newBlog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
  }
})

describe('already existing blogs', () => {
  test('blogs are returned as JSON', async () => {
    const token = await getToken('root', 'sekret')

    await api
      .get(blogUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const token = await getToken('root', 'sekret')

    const response = await api
      .get(blogUrl)
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog post is named id', async () => {
    const token = await getToken('root', 'sekret')

    const response = await api
      .get(blogUrl)
      .set('Authorization', `Bearer ${token}`)

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

    const token = await getToken('root', 'sekret')

    await api
      .post(blogUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getUserBlogs(token)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd[2]
    expect(contents.title).toContain(newBlog.title)
  })

  test('when \'likes\' property is missing it defaults to zero', async () => {
    const newBlog = new Blog({
      title: 'Test sample blog',
      author: 'Test author\'s name',
      url: 'https://www.testlink.com'
    })

    const token = await getToken('root', 'sekret')

    await api
      .post(blogUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getUserBlogs(token)
    expect(blogsAtEnd[2].likes).toBe(0)
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

    const token = await getToken('root', 'sekret')

    await api
      .post(blogUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(noTitle)
      .expect(400)

    await api
      .post(blogUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(noAuthor)
      .expect(400)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const token = await getToken('root', 'sekret')
    const blogs = await getUserBlogs(token)
    const blogToUpdateId = blogs[0].id

    const updatedBlog = await api
      .put(`${blogUrl}/${blogToUpdateId}`)
      .send({ likes: 100 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toBe(100)
  })

  test('fails and returns status code 400 if properties author and title are empty', async () => {
    const token = await getToken('root', 'sekret')
    const blogs = await getUserBlogs(token)
    const blogToUpdateId = blogs[0].id

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
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const user = await helper.createUser('root', 'sekret')

    for (const blog of helper.initialBlogs) {
      const newBlog = new Blog({ ...blog, user: user._id })
      await newBlog.save()
      user.blogs = user.blogs.concat(newBlog._id)
      await user.save()
    }
  })

  test('succeeds with status code 204 when id is valid', async () => {
    const token = await getToken('root', 'sekret')
    const blogs = await getUserBlogs(token)
    const blogToDelete = blogs[0].id

    await api
      .delete(`${blogUrl}/${blogToDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await getUserBlogs(token)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('fails with status code 401 if no valid token is provided', async () => {
    const token = await getToken('root', 'sekret')
    const blogs = await getUserBlogs(token)
    const blogToDelete = blogs[0].id

    await api
      .delete(`${blogUrl}/${blogToDelete}`)
      .expect(401)

    const blogsAtEnd = await getUserBlogs(token)
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('creating user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.createUser('root', 'sekret')
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

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toContain(newUser.body.username)
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
