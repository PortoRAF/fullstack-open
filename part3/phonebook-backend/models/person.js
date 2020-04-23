const mongoose = require("mongoose");
require("../services/mongodb");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
