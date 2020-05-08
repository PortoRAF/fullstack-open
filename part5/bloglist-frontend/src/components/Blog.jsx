import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid 1px black',
    marginBottom: 5
  }

  const detailStyle = { display: showDetails ? '' : 'none' }

  const toggleContent = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = () => {
    updateLikes(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleContent}>
        {showDetails ? 'hide' : 'view'}
      </button>
      <div style={detailStyle} className='blogDetails'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button
            id='like-btn'
            onClick={handleLike}>like</button>
        </div>
        <div>
          <button
            id='remove-btn'
            style={{ backgroundColor: 'cornflowerBlue' }}
            onClick={handleRemove}>
            remove
          </button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func,
  deleteBlog: PropTypes.func
}

export default Blog
