const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'some title', author: 'some author' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.username)
}

const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })
  await user.save()
  return user
}

module.exports = {
  initialBlogs,
  nonExistingId,
  usersInDb,
  createUser
}
