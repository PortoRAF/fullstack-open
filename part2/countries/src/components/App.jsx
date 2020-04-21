import axios from "axios";
import React, { useState, useEffect } from "react";
import Results from "./Results";

const App = () => {
  // Store search field value
  const [newCountry, setNewCountry] = useState("");
  // Store countries list returned by API
  const [countries, setCountries] = useState([]);

  // Call API once after app is rendered
  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleCountryInput = (event) => {
    event.preventDefault();
    setNewCountry(event.target.value);
  };

  const handleClick = (country) => {
    setNewCountry(country.name);
  };

  // When search field is empty, set list to undefined, otherwise
  // filteredCountries would contain every entries from countries list
  const filteredCountries =
    newCountry.length === 0
      ? undefined
      : countries.filter((country) =>
          country.name.toLowerCase().includes(newCountry.toLowerCase())
        );

  return (
    <div>
      <form>
        <label htmlFor="findCountry">find countries </label>
        <input
          type="text"
          value={newCountry}
          onChange={handleCountryInput}
          name="findCountry"
        />
      </form>
      <Results countries={filteredCountries} onClick={handleClick} />
    </div>
  );
};

export default App;
