import React, { useState, useEffect, useCallback } from 'react'
import Blog from './components/Blog'
import Alert from './components/Alert'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const showMessage = (message, success) => {
    setAlert(true)
    setMessage(message)
    setSuccess(success)
    setTimeout(() => {
      setAlert(null)
      setMessage('')
      setSuccess(false)
    }, 4000)
  }

  const getBlogs = useCallback(async () => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch {
      setMessage('could not load blogs')
      setSuccess(false)
      showMessage()
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(
        { username, password }
      )

      window.localStorage.setItem('BloglistLoggedUser', JSON.stringify(user))
      blogService.setToken(user.token)

      getBlogs()

      setUser(user)
      setUsername('')
      setPassword('')
      showMessage(`Successfully logged as ${user.username}`, true)
    } catch {
      showMessage('wrong username or password', false)
    }
  }

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem('BloglistLoggedUser')
      setUser(null)
      blogService.setToken(null)
      setBlogs([])
      setTitle('')
      setAuthor('')
      setUrl('')
      showMessage('successfully logged out', true)
    } catch {
      showMessage('failed to logout', false)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h2>application login</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="Username"
              value={username}
              onChange={({ target }) => { setUsername(target.value) }}
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="Password"
              value={password}
              onChange={({ target }) => { setPassword(target.value) }}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  const handleBlogCreate = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create(
        { title, author, url }
      )

      const newBlog = blogs.concat(blog)
      setBlogs(newBlog)

      setTitle('')
      setAuthor('')
      setUrl('')
      showMessage(`blog ${title} by ${author} added`, true)
    } catch {
      showMessage('failed to add new blog', false)
    }
  }

  const blogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleBlogCreate}>
          <div>
            title:
          <input
              type="text"
              name="Title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
          <input
              type="text"
              name="Author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
          <input
              type="text"
              name="Url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    )
  }

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      {alert === null ? null : <Alert message={message} success={success} />}
      {user === null ? loginForm() : blogList()}
    </div>
  )
}

export default App
