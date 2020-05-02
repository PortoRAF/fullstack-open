import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Note from "./Note";
import Notification from "./Notification";
import noteService from "../services/notes";
import loginService from "../services/login"
import Togglable from './Togglable'
import LoginForm from './LoginForm'
import NoteForm from './NoteForm'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null)

  const getNotes = () => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
      getNotes()
    }
  }, [])

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
      });
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        // Copy items from the old array except the newly updated
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const handleLogin = async (credentials) => {
    const { username, password } = credentials
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      getNotes()
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
    setNotes([])
    setShowAll(true)
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm userLogin={handleLogin} />
    </Togglable>
  )
  const noteFormRef = React.createRef()

  const noteForm = () => (
    <Togglable buttonLabel='add note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      {user === null
        ? loginForm()
        : (
          <div>
            <p>
              {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            {noteForm()}
            <ul>
              {notesToShow.map((note) => (
                <Note
                  key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note.id)}
                />
              ))}
            </ul>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? "important" : "all"}
            </button>
          </div>
        )
      }
      <Footer />
    </div>
  );
};

export default App;
