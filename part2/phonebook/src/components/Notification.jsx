import React from "react";

const successStyle = {
  color: "green",
  backgroundColor: "lightgrey",
  border: "3px solid green",
  borderRadius: "5px",
  fontSize: "20px",
  padding: "10px",
  marginBottom: "5px",
};

const errorStyle = {
  color: "red",
  backgroundColor: "lightgrey",
  border: "3px solid red",
  borderRadius: "5px",
  fontSize: "20px",
  padding: "10px",
  marginBottom: "5px",
};

const Notification = ({ message, success }) => {
  if (message === null) {
    return null;
  }

  if (success) {
    return <div style={successStyle}>{message}</div>;
  } else {
    return <div style={errorStyle}>{message}</div>;
  }
};

export default Notification;
