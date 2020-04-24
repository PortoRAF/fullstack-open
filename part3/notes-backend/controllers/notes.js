const Router = require('express').Router()
const Note = require('../models/note')

Router.get('/', (req, res, next) => {
  Note.find({})
    .then((notes) => res.json(notes))
    .catch((error) => next(error))
})

Router.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end()
    })
    .catch((error) => next(error))
})

Router.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

Router.post('/', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    date: new Date(),
  })

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote)
    })
    .catch((error) => next(error))
})

Router.put('/:id', (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important || false,
  }

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
  })
    .then((updatedNote) =>
      updatedNote ? res.json(updatedNote) : res.status(404).end()
    )
    .catch((error) => next(error))
})

module.exports = Router
