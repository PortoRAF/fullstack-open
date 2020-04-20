import axios from "axios";
import React, { useState, useEffect } from "react";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Filter from "./Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showWith, setShowWith] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("resolved");
      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "persons");
  const addName = (event) => {
    event.preventDefault();
    if (!persons.every((person) => person.name !== newName)) {
      return alert(`${newName} is already added to phonebook`);
    }
    setPersons(persons.concat({ name: newName, number: newNumber }));
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleShowWithChange = (event) => {
    setShowWith(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(showWith.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <h2>Add new contact</h2>
      <PersonForm
        onSubmit={addName}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {personsToShow.map((person) => (
        <Persons key={person.name} person={person} />
      ))}
      <Filter filter={showWith} onChange={handleShowWithChange} />
    </div>
  );
};

export default App;
