import React from "react";

const Total = ({ parts }) => {
  const reducer = (total, part) => total + part.exercises;
  const total = parts.reduce(reducer, 0);

  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

export default Total;
