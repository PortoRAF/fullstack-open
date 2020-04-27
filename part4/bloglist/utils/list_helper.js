const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (posts) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return posts.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (acc, current) => {
    let max = acc.likes > current.likes ? acc : current
    return (({ title, author, likes }) => ({ title, author, likes }))(max)
  }

  return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null
  }

  const numOfBlogsByAuthor = _.countBy(blogs, 'author')
  const authors = Object.keys(numOfBlogsByAuthor)

  const maxAuthor = authors.reduce((acc, curr) => {
    return numOfBlogsByAuthor[acc] > numOfBlogsByAuthor[curr] ? acc : curr
  })

  return {
    author: maxAuthor,
    blogs: numOfBlogsByAuthor[maxAuthor]
  }
}

const mostLikes = (blogs) => {
  if (_.isEmpty(blogs)) {
    return null
  }

  const groupedByLikes = blogs.reduce((acc, curr) => {
    let id = acc[curr.author]
    if (id) {
      id.likes += curr.likes
    } else {
      acc[curr.author] = curr
      // delete curr.author
    }
    return acc
  }, {})

  const authors = Object.keys(groupedByLikes).map((author) => {
    let res = new Object
    res.author = groupedByLikes[author].author
    res.likes = groupedByLikes[author].likes
    return res
  })

  const result = _.maxBy(authors, 'likes')

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
