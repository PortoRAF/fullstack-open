const jwt = require('jsonwebtoken')
const Router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

Router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', {
        username: 1,
        name: 1,
        id: 1
      })

    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

Router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog
      .findById(req.params.id)
      .populate('user')

    if (blog) {
      return res.json(blog)
    }
    res.status(404).end()
  } catch (error) {
    next(error)
  }
})

const verifyAuth = (request) => {
  const auth = request.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.substring(7)
  }
  return null
}

Router.post('/', async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body

    const token = verifyAuth(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if (!token || !decodedToken.id || !user) {
      return res.status(401).send({ error: 'token missing or invalid' })
    }


    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
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
