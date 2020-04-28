const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

const baseUrl = ('/api/blogs')

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
      .get(baseUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get(baseUrl)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog post is named id', async () => {
    const response = await api.get(baseUrl)

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
      .post(baseUrl)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get(baseUrl)
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
      .post(baseUrl)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get(baseUrl)
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
      .post(baseUrl)
      .send(noTitle)
      .expect(400)

    await api
      .post(baseUrl)
      .send(noAuthor)
      .expect(400)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogs = await api.get(baseUrl)
    const blogToUpdateId = blogs.body[0].id

    const updatedBlog = await api
      .put(`${baseUrl}/${blogToUpdateId}`)
      .send({ likes: 100 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toBe(100)
  })

  test('fails and returns status code 400 if properties author and title are empty', async () => {
    const blogs = await api.get(baseUrl)
    const blogToUpdateId = blogs.body[0].id

    const noTitle = new Blog({ title: '' })
    const noAuthor = new Blog({ author: '' })

    await api
      .put(`${baseUrl}/${blogToUpdateId}`)
      .send(noTitle)
      .expect(400)

    await api
      .put(`${baseUrl}/${blogToUpdateId}`)
      .send(noAuthor)
      .expect(400)
  })

  test('fails and returns status code 404 if id is valid but does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .put(`${baseUrl}/${nonExistingId}`)
      .expect(404)
  })

  test('fails and returns status code 400 if id is invalid', async () => {
    const invalidId = 555

    await api
      .put(`${baseUrl}/${invalidId}`)
      .expect(400)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 when id is valid', async () => {
    const blogs = await api.get(baseUrl)
    const blogToDeleteId = blogs.body[0].id

    await api
      .delete(`${baseUrl}/${blogToDeleteId}`)
      .expect(204)

    const blogsAtEnd = await api.get(baseUrl)
    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length - 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
