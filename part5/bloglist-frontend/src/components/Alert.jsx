import React from 'react'

const style = {
  backgroundColor: "lightgrey",
  border: "3px solid",
  borderRadius: "5px",
  fontSize: "20px",
  padding: "10px",
  marginBottom: "5px",
}

const successStyle = {
  color: "green",
  borderColor: "green",
}

const failureStyle = {
  color: "red",
  borderColor: "red",
}

const Alert = ({ message, success }) => {
  if (message === null) { return null }

  if (success) {
    return <div style={{ ...style, ...successStyle }}>{message}</div>
  } else {
    return <div style={{ ...style, ...failureStyle }}>{message}</div>
  }
}

export default Alert
