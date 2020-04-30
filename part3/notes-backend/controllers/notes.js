const Router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

Router.get('/', async (req, res, next) => {
  try {
    const notes = await Note
      .find({})
      .populate('user', {
        username: 1,
        name: 1
      })
    return res.json(notes.map(note => note.toJSON()))
  } catch (error) {
    next(error)
  }
})

Router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note) {
      return res.json(note.toJSON())
    }
    return res.status(404).end()
  } catch (error) {
    next(error)
  }
})

Router.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

Router.post('/', async (req, res, next) => {
  const { content, important, userId } = req.body

  const user = await User.findById(userId)

  const note = new Note({
    content: content,
    important: important || false,
    date: new Date(),
    user: user._id
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    return res.json(savedNote.toJSON())
  } catch (error) {
    next(error)
  }
})

Router.put('/:id', async (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important || false,
  }

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
  })
    .then((updatedNote) =>
      updatedNote ? res.json(updatedNote.toJSON()) : res.status(404).end()
    )
    .catch((error) => next(error))
})

module.exports = Router
