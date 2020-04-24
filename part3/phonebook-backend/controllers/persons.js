const Router = require('express').Router()
const Person = require('../models/person')

Router.get('/info', (req, res, next) => {
  Person.estimatedDocumentCount((error, count) => {
    if (error) {
      next(error)
    }
    const date = new Date()
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

Router.get('/', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

Router.get('/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error))
})

Router.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

Router.post('/', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  })

  person
    .save()
    .then((person) => res.send(person))
    .catch((error) => next(error))
})

Router.put('/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) =>
      updatedPerson ? res.json(updatedPerson) : res.status(404).end()
    )
    .catch((error) => next(error))
})

module.exports = Router
