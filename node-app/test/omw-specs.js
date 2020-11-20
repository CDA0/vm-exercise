/* eslint-env mocha */
const { expect } = require('chai');
const sinon = require('sinon'); // eslint-disable-line import/no-extraneous-dependencies
const rp = require('request-promise');
const OpenWeatherMap = require('../omw');
const testData = require('./test-data');

describe('OpenWeatherMap', () => {
  describe('constructor', () => {
    it('creates an instance', () => {
      const owm = new OpenWeatherMap();
      expect(owm).to.be.instanceof(OpenWeatherMap);
      expect(owm.appid).to.not.exist; // eslint-disable-line no-unused-expressions
    });

    it('sets appid on new instance', () => {
      const owm = new OpenWeatherMap({ appid: 'abc' });
      expect(owm).to.be.instanceof(OpenWeatherMap);
      expect(owm.appid).to.eql('abc');
    });
  });

  describe('fetchForecast', () => {
    it('calls rp.get with correct args', () => {
      const owm = new OpenWeatherMap({ appid: 'abc' });
      const mock = sinon.mock(rp);
      mock.expects('get').withExactArgs({
        uri: 'http://api.openweathermap.org/data/2.5/forecast',
        qs: {
          q: 'glasgow,gb',
          mode: 'json',
          appid: 'abc',
          units: 'metric',
        },
        json: true,
      });
      owm.fetchForecast('glasgow');
      mock.verify();
    });
  });

  describe('currentConditions', () => {
    let owm = null;

    beforeEach(() => {
      owm = new OpenWeatherMap({ appid: 'abc' });
    });

    it('returns a single object with correct keys', () => {
      const data = owm.currentConditions(testData);
      expect(data).to.be.instanceof(Object);
      expect(data).to.have.property('forecast', testData.list[0].weather[0].description);
      expect(data).to.have.property('temperature', testData.list[0].main.temp);
      expect(data).to.have.property('wind', testData.list[0].wind.speed);
    });
  });

  describe('hourly', () => {
    let owm = null;

    beforeEach(() => {
      owm = new OpenWeatherMap({ appid: 'abc' });
    });

    it('returns an object with 6 keys based on test data', () => {
      const data = owm.hourly(testData);
      expect(Object.keys(data)).to.have.length(6);
      expect(Object.keys(data)).to.eql(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']);
    });

    it('returns an object where each key is an array', () => {
      const data = owm.hourly(testData);
      expect(data[Object.keys(data)[0]]).to.have.length(2);
      expect(data[Object.keys(data)[1]]).to.have.length(8);
      expect(data[Object.keys(data)[2]]).to.have.length(8);
      expect(data[Object.keys(data)[3]]).to.have.length(8);
      expect(data[Object.keys(data)[4]]).to.have.length(8);
      expect(data[Object.keys(data)[5]]).to.have.length(6);
    });

    it('returns an object with correct deep fields', () => {
      const data = owm.hourly(testData);
      expect(data[Object.keys(data)[0]][0]).to.have.deep.property('time');
      expect(data[Object.keys(data)[0]][0]).to.have.deep.property('forecast');
      expect(data[Object.keys(data)[0]][0]).to.have.deep.property('temperature');
      expect(data[Object.keys(data)[0]][0]).to.have.deep.property('wind');
    });
  });

  describe('daily', () => {
    let owm = null;

    beforeEach(() => {
      owm = new OpenWeatherMap({ appid: 'abc' });
    });

    it('returns an object with 6 keys based on test data', () => {
      const data = owm.daily(testData);
      expect(Object.keys(data)).to.have.length(6);
      expect(Object.keys(data)).to.eql(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']);
    });

    it('object where each key is an object', () => {
      const data = owm.daily(testData);
      expect(data[Object.keys(data)[0]]).to.be.instanceof(Object);
      expect(data[Object.keys(data)[1]]).to.be.instanceof(Object);
      expect(data[Object.keys(data)[2]]).to.be.instanceof(Object);
      expect(data[Object.keys(data)[3]]).to.be.instanceof(Object);
      expect(data[Object.keys(data)[4]]).to.be.instanceof(Object);
      expect(data[Object.keys(data)[5]]).to.be.instanceof(Object);
    });

    it('object has correct fields', () => {
      const data = owm.daily(testData);
      expect(data[Object.keys(data)[0]]).to.have.deep.property('forecast');
      expect(data[Object.keys(data)[0]]).to.have.deep.property('temperature');
      expect(data[Object.keys(data)[0]]).to.have.deep.property('wind');
    });
  });
});
