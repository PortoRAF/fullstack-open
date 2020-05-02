import React, { useState } from 'react'

const LoginForm = ({ userLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    userLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
