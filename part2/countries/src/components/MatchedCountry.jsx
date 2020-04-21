import React from "react";
import Flag from "./Flag";
import Language from "./Language";

const MatchedCountry = ({ country }) => {
  const { name, capital, population, languages, flag } = country[0];

  return (
    <div>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <h2>languages</h2>
      <ul>
        {languages.map((lang) => (
          <Language key={lang.iso639_1} lang={lang} />
        ))}
      </ul>
      <Flag flag={flag} />
    </div>
  );
};

export default MatchedCountry;
