/* eslint-disable class-methods-use-this */
const moment = require('moment');
const rp = require('request-promise');

/**
 * @class OpenWeatherMap
 */
class OpenWeatherMap {
  constructor(options) {
    options = options || {}; // eslint-disable-line no-param-reassign
    this.appid = options.appid;
  }

  /**
   * Fetch the forecast from openweathermap
   * @param {String} city   UK City to
   * @returns {Object}      openweathermap data
   */
  fetchForecast(city) {
    const options = {
      uri: 'http://api.openweathermap.org/data/2.5/forecast',
      qs: {
        q: `${city},gb`,
        mode: 'json',
        appid: this.appid,
        units: 'metric',
      },
      json: true,
    };
    return rp.get(options);
  }

  /**
   * Parse the current conditions
   * @param {Object} data   data from openweathermap
   * @returns {Object}      3 hourly forecast data
   */
  currentConditions(data) {
    const currentCond = data.list[0];
    return {
      forecast: currentCond.weather[0].description,
      temperature: currentCond.main.temp,
      wind: currentCond.wind.speed,
    };
  }

  /**
   * Get the weather data for each 3 hour period
   * @param {Object} data   data from openweathermap
   * @returns {Object}      3 hourly forecast data
   */
  hourly(data) {
    const forecastData = data.list;
    const forecast = {};
    forecastData.forEach((f) => {
      const day = moment.unix(f.dt).format('ddd');

      if (!forecast[day]) forecast[day] = [];

      forecast[day].push({
        time: moment.unix(f.dt).format('ha'),
        forecast: f.weather[0].description,
        temperature: f.main.temp,
        wind: f.wind.speed,
      });
    });
    return forecast;
  }

  /**
   * Get the weather data for 12:00pm each day
   * @param {Object} data   data from openweathermap
   * @returns {Object}      daily forecast data
   */
  daily(data) {
    const forecastData = data.list;
    const forecast = {};

    forecastData.forEach((f) => {
      const day = moment.unix(f.dt).format('ddd');

      if (!forecast[day]) forecast[day] = [];
      forecast[day] = {
        forecast: f.weather[0].description,
        temperature: f.main.temp,
        wind: f.wind.speed,
      };
    });

    return forecast;
  }
}

module.exports = OpenWeatherMap;
