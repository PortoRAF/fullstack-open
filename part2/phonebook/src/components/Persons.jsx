import React from "react";

const Persons = ({ person, onClick }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => onClick(person)}>delete</button>
  </div>
);

export default Persons;
