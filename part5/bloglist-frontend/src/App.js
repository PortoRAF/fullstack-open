import React, { useState, useEffect, useCallback } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({})

  const showMessage = (message, mode = 'error') => {
    setNotification({ message, mode })
    setTimeout(() => {
      setNotification({})
    }, 4000)
  }

  const getBlogs = useCallback(async () => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      setNotification('could not load blogs')
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('BloglistLoggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getBlogs()
    }
  }, [getBlogs])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('BloglistLoggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      getBlogs()
      showMessage(`Successfully logged as ${user.username}`, 'success')
    } catch (error) {
      showMessage('wrong username or password')
    }
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('BloglistLoggedUser')
      setUser(null)
      blogService.setToken(null)
      setBlogs([])
      showMessage('successfully logged out', 'success')
    } catch (error) {
      showMessage('failed to logout')
    }
  }

  const handleBlogCreate = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      const updatedBlogs = blogs.concat(newBlog)
      setBlogs(updatedBlogs)
      showMessage(`blog ${newBlog.title} by ${newBlog.author} added`, 'success')
    } catch (error) {
      showMessage('failed to add new blog')
    }
  }

  const handleUpdateLikes = async (blogObject) => {
    try {
      const newBlog = await blogService.update(blogObject)
      const updatedBlogs = blogs.map(blog => (
        (blog.id === newBlog.id) ? newBlog : blog)
      )
      setBlogs(updatedBlogs)
    } catch (error) {
      showMessage('unable to process \'like\'')
    }
  }

  const handleDeleteBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject)
      const updatedBlogs = blogs.filter(blog => blog.id !== blogObject.id)
      setBlogs(updatedBlogs)
      showMessage(`removed blog ${blogObject.title} by ${blogObject.author}`, 'success')
    } catch (error) {
      showMessage('unable to remove blog')
    }
  }

  const loginForm = () => {
    return (
      <Togglable buttonText='login'>
        <LoginForm handleLogin={handleLogin} />
      </Togglable>
    )
  }

  const blogFormRef = React.createRef()

  const blogForm = () => (
    <Togglable buttonText='add blog' ref={blogFormRef}>
      <BlogForm createBlog={handleBlogCreate} />
    </Togglable>
  )

  const blogList = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    return (
      sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={handleUpdateLikes}
          deleteBlog={handleDeleteBlog}
        />
      )
    )
  }

  return (
    <div>
      {Object.keys(notification).length === 0
        ? null
        : <Notification notification={notification} />}
      {user === null ? loginForm() : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App
