const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req) => (req.body.name ? JSON.stringify(req.body) : " "));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const MAX_CONTACTS = 10;

let persons = [
  {
    name: "Arto Hellas",
    number: "12-34-56789",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send(
    "<p>Hello! This is phonebook's backend.</p><p>You can find the api at /api/persons</p>"
  );
});

app.get("/info", (req, res, next) => {
  Person.estimatedDocumentCount((error, count) => {
    if (error) {
      next(error);
    }
    const date = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: "name missing",
    });
  }
  if (!req.body.number) {
    return res.status(400).send({
      error: "number missing",
    });
  }
  Person.find({ name: req.body.name }).then((persons) => {
    if (persons.length > 0) {
      res.status(400).send("name must be unique");
    } else {
      const person = new Person({
        name: req.body.name,
        number: req.body.number,
      });
      person.save().then((person) => res.send(person));
    }
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: "name missing",
    });
  }
  if (!req.body.number) {
    return res.status(400).send({
      error: "number missing",
    });
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    res.status(400).send({ error: "bad formatted id" });
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
