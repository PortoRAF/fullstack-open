import React from "react";
import Country from "./Country";
import MatchedCountry from "./MatchedCountry";

const Results = ({ countries, onClick }) => {
  if (countries) {
    const numOfResults = countries.length;
    if (numOfResults === 1) {
      return <MatchedCountry country={countries} />;
    } else if (numOfResults > 10) {
      return <div>Too many matches, narrow your search</div>;
    } else {
      return countries.map((country) => (
        <Country key={country.alpha3Code} country={country} onClick={onClick} />
      ));
    }
  } else {
    return <div>Type your search</div>;
  }
};

export default Results;
