import React from "react";
import Country from "./Country";
import MatchedCountry from "./MatchedCountry";

const Results = ({ data }) => {
  if (data) {
    const numOfResults = data.length;
    if (numOfResults === 1) {
      return <MatchedCountry data={data} />;
    } else if (numOfResults > 10) {
      return <div>Too many matches, try a narrower search</div>;
    } else {
      return data.map((country) => (
        <Country key={country.alpha3Code} country={country} />
      ));
    }
  } else {
    return <div>Type your search</div>;
  }
};

export default Results;
