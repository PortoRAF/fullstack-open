import React from "react";
import Button from "./Button";
import Input from "./Input";

const PersonForm = (props) => {
  const {
    onSubmit,
    nameValue,
    numberValue,
    onNameChange,
    onNumberChange,
  } = props;

  return (
    <form onSubmit={onSubmit}>
      <Input text="name" value={nameValue} onChange={onNameChange} />
      <Input text="number" value={numberValue} onChange={onNumberChange} />
      <Button text="add" />
    </form>
  );
};

export default PersonForm;
