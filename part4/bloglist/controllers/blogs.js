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

Router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      return res.json(blog)
    }
    res.status(404).end()
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

Router.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

Router.put('/:id', async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        omitUndefined: true
      })

    if (updatedBlog) {
      return res.json(updatedBlog)
    }
    res.status(404).end()
  } catch (error) {
    next(error)
  }
})

module.exports = Router
