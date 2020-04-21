import React from "react";

const Country = ({ country, onClick }) => (
  <div>
    {country.name}
    <button onClick={() => onClick(country)}>show</button>
  </div>
);

export default Country;
