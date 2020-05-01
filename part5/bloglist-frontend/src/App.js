import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('BloglistLoggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getBlogs()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(
        { username, password }
      )

      window.localStorage.setItem('BloglistLoggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      getBlogs()
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('unable to login')
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('BloglistLoggedUser')
    setUser(null)
    blogService.setToken(null)
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

  const blogList = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      {user === null
        ? loginForm()
        : blogList()}
    </div>
  )
}

export default App
