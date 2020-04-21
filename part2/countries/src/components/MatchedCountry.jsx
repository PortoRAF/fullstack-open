import axios from "axios";
import React, { useState, useEffect } from "react";
import Flag from "./Flag";
import Language from "./Language";
import Weather from "./Weather";

const MatchedCountry = ({ country }) => {
  const { name, capital, population, languages, flag } = country[0];
  const [weather, setWeather] = useState();

  useEffect(() => {
    const url =
      "http://api.weatherstack.com/current?access_key=" +
      process.env.REACT_APP_WEATHER_API_KEY +
      "&query=" +
      capital;
    axios.get(url).then((response) => {
      setWeather(response.data);
    });
  }, [capital]);

  return (
    <div>
      <h1>{name}</h1>
      <div>capital {capital}</div>
      <div>population {population}</div>
      <h2>Spoken languages</h2>
      <ul>
        {languages.map((lang) => (
          <Language key={lang.iso639_1} lang={lang} />
        ))}
      </ul>
      <Flag flag={flag} />
      <h2>Weather in {capital}</h2>
      <Weather weather={weather} />
    </div>
  );
};

export default MatchedCountry;
