import React from "react";

const Weather = ({ weather }) => {
  if (weather) {
    const { current } = weather;
    const {
      temperature,
      wind_speed: windSpeed,
      wind_dir: windDir,
      weather_icons: icons,
    } = current;

    return (
      <div>
        <div>
          <strong>temperature: </strong> {temperature} Celsius
        </div>
        <img src={icons[0]} alt="weather icon" />
        <div>
          <strong>wind: </strong> {windSpeed} kph direction {windDir}
        </div>
      </div>
    );
  } else {
    return "";
  }
};

export default Weather;
