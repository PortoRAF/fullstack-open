const Router = require('express').Router()
const Blog = require('../models/Blog')

Router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

Router.post('/', async (req, res, next) => {
  const { title, author, url, likes } = req.body
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  })

  try {
    const result = await blog.save()
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = Router
