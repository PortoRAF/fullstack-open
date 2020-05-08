import React, { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const userLogin = (event) => {
    event.preventDefault()
    handleLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>application login</h2>
      <form onSubmit={userLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            name="Username"
            value={username}
            onChange={({ target }) => { setUsername(target.value) }}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            name="Password"
            value={password}
            onChange={({ target }) => { setPassword(target.value) }}
          />
        </div>
        <button id='user-login-btn' type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
