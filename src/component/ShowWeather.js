import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDetails from "./WeatherDetails";
import "../style.css";

const ShowWeather = () => {
  let environmentKey = "879c9eb8f7e5cdcb406856b175ab5976";
  const [cityName, setCityName] = useState("bangalore");
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const searchWeather = async () => {
    let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${environmentKey}`;
    let forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=40&units=metric&appid=${environmentKey}`;
    let result_cur = await axios.get(currentWeatherURL);
    let result_forecast = await axios.get(forecastWeatherURL);

    setWeatherData(result_cur.data);
    setForecastData(result_forecast.data);

    // console.log(result.data);
    let description = result_cur.data.weather[0].description;
    switch (true) {
      case description.includes("clear") || description.includes("sun"):
        setBackgroundImageUrl("/sunny.jpg");
        break;
      case description.includes("cloud"):
        setBackgroundImageUrl("/clouds.jpg");
        break;
      case description.includes("rain") || description.includes("drizzle"):
        setBackgroundImageUrl("/rain.jpg");
        break;
      case description.includes("haze"):
        setBackgroundImageUrl("/haze.jpg");
        break;
      case description.includes("fog"):
        setBackgroundImageUrl("/fog.jpg");
        break;
      case description.includes("snow"):
        setBackgroundImageUrl("/snow.jpg");
        break;
      default:
        setBackgroundImageUrl("/regularday.jpg");
    }
  };

//   console.log("ishu", backgroundImageUrl);
  return (
    <>
      <div
        className="main-container"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="weather-toolbar">
          <div style={{ fontSize: "40px" }}>Weather Updates</div>

          {/* <h1>Weather Updates</h1> */}
        </div>

        <div className="search-box">
          <div className="search">
            <div className="search-field">
              <input
                type={"text"}
                placeholder="Search by city name"
                onChange={(e) => setCityName(e.target.value)}
              />
            </div>
            <button
              className="search-button"
              type="button"
              onClick={searchWeather}
            >
              Search
            </button>
          </div>
        </div>

        {Object.keys(weatherData).length > 0 && (
          <WeatherDetails
            weatherData={weatherData}
            forecastData={forecastData}
          />
        )}
      </div>
    </>
  );
};

export default ShowWeather;
