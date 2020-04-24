import React, { useState, useEffect } from "react";
import personsService from "../services/Persons";
import Notification from "./Notification";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Filter from "./Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showWith, setShowWith] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const showMessage = (message, success) => {
    setSuccess(success);
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const addName = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };
    if (!persons.every((person) => person.name !== newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace old number?`
        )
      ) {
        const changedPerson = persons.find((person) => person.name === newName);
        personsService
          .replace(changedPerson.id, newPerson)
          .then((returnedPerson) => {
            setPersons(
              persons
                .filter((p) => p.id !== returnedPerson.id)
                .concat(returnedPerson)
            );
            setNewName("");
            setNewNumber("");
            showMessage(`Updated ${returnedPerson.name}`, true);
          })
          .catch((error) => showMessage(error.response.data.error, false));
      }
    } else {
      personsService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          showMessage(`Added ${returnedPerson.name}`, true);
        })
        .catch((error) => showMessage(error.response.data.error, false));
    }
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

  const handleDeleteButton = (person) => {
    if (window.confirm("Delete " + person.name + "?")) {
      personsService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        showMessage("Contact successfully removed", true);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage} success={success} />
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
        <Persons key={person.id} person={person} onClick={handleDeleteButton} />
      ))}
      <Filter filter={showWith} onChange={handleShowWithChange} />
    </div>
  );
};

export default App;
