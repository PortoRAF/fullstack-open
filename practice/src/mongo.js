const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "Promises are fine if they're in JS",
//   date: new Date(),
//   important: true,
// });

// note.save().then((response) => {
//   console.log("note saved");
//   mongoose.connection.close();
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
