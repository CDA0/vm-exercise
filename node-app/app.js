const express = require('express');
const OpenWeatherMap = require('./omw');

const app = express();

const appid = process.env.APPID || 'b2e84cc56524b139a761c420392095b8';

const owm = new OpenWeatherMap({ appid });

app.get('*', async (req, res, next) => {
  try {
    const forecastData = await owm.fetchForecast(req.query.city);

    const data = {
      city: `${forecastData.city.name}, gb`,
      currentConditions: owm.currentConditions(forecastData),
      forecast: owm.hourly(forecastData),
      daily: owm.daily(forecastData),
    };

    res.send(data);
  } catch (e) {
    next(e);
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000'); // eslint-disable-line no-console
});
