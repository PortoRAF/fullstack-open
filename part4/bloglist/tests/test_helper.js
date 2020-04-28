const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  nonExistingId
}
