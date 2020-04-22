const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 3001;

const app = express();

morgan.token("body", (req) => (req.body.name ? JSON.stringify(req.body) : " "));

app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("build"));

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

app.get("/info", (req, res) => {
  const num = persons.length;
  const date = new Date();

  res.send(`<p>Phonebook has info for ${num} people</p><p>${date}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    persons = persons.filter((p) => p.id !== id);
    res.status(204).send(person);
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const id = Math.floor(Math.random() * MAX_CONTACTS);

  if (persons.find((p) => p.id === id)) {
    return generateId();
  }

  return id;
};

app.post("/api/persons", (req, res) => {
  if (persons.length >= MAX_CONTACTS) {
    return res.status(400).send({
      error: "maximum number reached",
    });
  }
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
  if (persons.find((p) => p.name === req.body.name)) {
    return res.status(400).send({
      error: "name must be unique",
    });
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.send(person);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
