const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", personSchema);

if (process.argv.length > 2) {
  // Save input data into db
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });
  person.save().then((response) => {
    console.log(
      `added ${response.name} number ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  // Retrieve all data
  Person.find({}).then((response) => {
    console.log("phonebook:");
    response.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
