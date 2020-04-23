const mongoose = require("mongoose");
require("../services/mongodb");

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toString();
    delete returnedDocument._id;
    delete returnedDocument.__v;
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
