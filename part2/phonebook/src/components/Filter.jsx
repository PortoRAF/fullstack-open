import React from "react";

const Filter = ({ filter, onChange }) => (
  <p>
    filter shown with
    <input value={filter} onChange={onChange} />
  </p>
);

export default Filter;
