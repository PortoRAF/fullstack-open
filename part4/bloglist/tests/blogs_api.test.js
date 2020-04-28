const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const baseUrl = ('/api/blogs')

const initialBlogs = [
  {
    title: 'First sample blog',
    author: 'Some author\'s name',
    url: 'https://www.somelink.com',
    likes: 15
  },
  {
    title: 'Second sample blog',
    author: 'Another author\'s name',
    url: 'https://www.someotherlink.com',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of initialBlogs) {
    const newBlog = new Blog(blog)
    await newBlog.save()
  }
})

test('blogs are returned as JSON', async () => {
  await api
    .get(baseUrl)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get(baseUrl)

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier property of the blog post is named id', async () => {
  const response = await api.get(baseUrl)

  expect(response.body[0].id).toBeDefined()
})

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
  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)

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

afterAll(() => {
  mongoose.connection.close()
})