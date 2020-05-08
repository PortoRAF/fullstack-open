import React from 'react'
import PropTypes from 'prop-types'

const style = {
  backgroundColor: 'lightgrey',
  border: '3px solid',
  borderRadius: '5px',
  fontSize: '20px',
  padding: '10px',
  marginBottom: '5px',
}

const successStyle = {
  color: 'green',
  borderColor: 'green',
}

const failureStyle = {
  color: 'red',
  borderColor: 'red',
}

const Notification = ({ notification }) => {
  const { message, mode } = notification

  if (message === null) { return null }

  if (mode === 'success') {
    return (
      <div className='success' style={{ ...style, ...successStyle }}>
        {message}
      </div>
    )
  } else {
    return (
      <div className='error' style={{ ...style, ...failureStyle }}>
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}

export default Notification
