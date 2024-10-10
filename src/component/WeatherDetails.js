import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "../style.css";

const WeatherDetails = ({ weatherData, forecastData }) => {
  const [forecastDays, setForecastDays] = useState([]);
  const [forecastTime, setForecastTime] = useState([]);
  const [groupedForecasts, setGroupedForecasts] = useState({});
  const [hourWeatherData, setHourWeatherData] = useState({});
  const [selectHour, setSelectHour] = useState(-1);

  useEffect(() => {
    // setGroupedForecasts({});
    // setForecastDays([]);
    const grouped = {};
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!grouped[date]) {
        grouped[date] = [];
      }
      console.log("date", date);
      const formattedDate = new Date(item.dt * 1000).toLocaleString(); // Replace this with date formatting of your choice
      console.log("formattedDate", formattedDate);
      //   item.dt = formattedDate;

      grouped[date].push(item);
    });
    setGroupedForecasts(grouped);
    const days = Object.keys(grouped);
    setForecastDays(days);
  }, []);

  //   console.log("weather data", weatherData);
  //   console.log("groupedForecasts", groupedForecasts);
  //   console.log("forecastDays", forecastDays);

  const getDateDetails = (rec) => {
    const foretime = [];
    const groupKeys = Object.keys(groupedForecasts);
    const group = groupedForecasts[rec];
    const currentTime = weatherData.dt;
    console.log("currentTime", currentTime);
    console.log("group", group);
    console.log("groupKeys", groupKeys);

    group?.map((record) => {
      if (record.dt > currentTime) {
        const date = new Date(record.dt * 1000);
        const options = { hour: "numeric", minute: "numeric", hour12: true }; // Format options for time
        const formattedTime = date.toLocaleTimeString([], options);

        const weatherInfo = {
          time: formattedTime,
          temperature: record.main.temp,
          description: record.weather[0].description,
          windspeed: record.wind.speed,
          feelsLike: record.main.feels_like,
        };
        foretime.push(weatherInfo);
      }
    });

    setForecastTime(foretime);
    console.log("foretime", foretime);
  };
  console.log("forecastTime", forecastTime);
  return (
    <>
      <div className="weather-container ">
        <div className="weather-info">
          <div className="city-country">
            <h2 style={{ margin: "0px" }}>
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div style={{ display: "flex" }}>
              <p>Weather: &nbsp;</p>
              <p style={{ color: "#c3cbd2" }}>
                {weatherData.weather[0].description}
              </p>
            </div>

            <div style={{ display: "flex" }}>
              <p>Time: &nbsp;</p>
              <p style={{ color: "#c3cbd2" }}>
                {format(new Date(weatherData.dt * 1000), "PPpp")}
              </p>
            </div>
          </div>

          <table className="details-table">
            <tr>
              <th>Temperature</th>
              <td>{weatherData.main.temp}°C</td>
            </tr>
            <tr>
              <th>Feels like</th>
              <td>{weatherData.main.feels_like}°C</td>
            </tr>
            <tr>
              <th>Visibility</th>
              <td>{weatherData.visibility / 10} km</td>
            </tr>
            <tr>
              <th>Wind Speed</th>
              <td>{weatherData.wind.speed} m/s</td>
            </tr>
          </table>

          {/* <div style={{display:"flex", gap:20, marginTop:20}}> */}
          <div className="forecast-cards">
            {forecastDays?.map((rec, index) => {
              //   console.log("rec", rec);
              if (rec === "Invalid Date") {
                return;
              }

              const dateObj = new Date(rec); // Convert the string to a Date object

              // Use toLocaleString to get the month and date in the desired format
              const monthAndDay = dateObj.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
              });

              //   let splittedSpring = rec.split(" ")
              return (
                // <div style={{backgroundColor:"white", width:70, height:50, color:"black", fontWeight:"bold"}}onClick={()=>getDateDetails(rec)}>{splittedSpring[1]}{splittedSpring[2]}</div>
                <button
                  key={index}
                  className="date-card"
                  onClick={() => getDateDetails(rec)}
                >
                  {monthAndDay}
                </button>
              );
            })}
          </div>
          {/* <br/> */}
          <div className="weatherTime">
            {forecastTime?.map((rec, index) => {
              return (
                <>
                  <span
                    style={{ fontSize: selectHour==index?"20px":"15px", color: "#fff", fontWeight: selectHour==index?"bold":"100"}}
                    onClick={() => {setHourWeatherData(rec); setSelectHour(index)}}
                  >
                    {rec.time}
                  </span>
                  {forecastTime.length - 1 != index && (
                    <div
                      style={{
                        width: "40px",
                        flexGrow: 1,
                        height: "1px",
                        backgroundColor: "#fff",
                        marginRight: "2px",
                        marginLeft: "2px",
                        marginTop: "10px",
                        border: "0.5px white solid",
                      }}
                    ></div>
                  )}
                </>
              );
            })}
          </div>

          {Object.keys(hourWeatherData).length > 0 && (
            <div style={{ display: "flex", marginTop: "10px" }}>
              <div className="weather-tooltip">
                <div className="inner-block">
                  <div className="left-block">
                    <div className="temp">{hourWeatherData.temperature} °C</div>
                    <div>{hourWeatherData.description}</div>
                  </div>
                  <div className="right-block">
                    <div>
                      <span className="indent">Feels Like: </span>
                      {hourWeatherData.feelsLike} °C
                    </div>
                    <div>
                      <span className="indent">Wind Speed: </span>
                      {hourWeatherData.windspeed} m/s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherDetails;
