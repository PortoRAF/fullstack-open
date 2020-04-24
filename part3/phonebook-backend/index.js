const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req) => (req.body.name ? JSON.stringify(req.body) : ' '))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/', (req, res) => {
  res.send(
    '<p>Hello! This is phonebook\'s backend.</p><p>You can find the api at /api/persons</p>'
  )
})

app.get('/info', (req, res, next) => {
  Person.estimatedDocumentCount((error, count) => {
    if (error) {
      next(error)
    }
    const date = new Date()
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  })

  person
    .save()
    .then((person) => res.send(person))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'bad formatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
