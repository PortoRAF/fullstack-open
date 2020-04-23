const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Node!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes.map((note) => note.toJSON()));
  });
});

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id)
    .then((note) => res.json(note))
    .catch((error) => res.status(404).end());
});

app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then((response) =>
      res.status(204).send(`deleted ${response.deletedCount}`)
    )
    .catch((error) => res.status(404).end());
});

app.post("/api/notes", (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.put("/api/notes/:id", (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    content: req.body.content,
    important: req.body.important || false,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => res.status(404).end());
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
