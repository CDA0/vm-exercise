# React OpenWeatherMap

Simple express and cli applications to query data from [OpenWeatherMap](http://openweathermap.org/forecast5).

## Requirements

This project requires node v7 and was tested with 7.4.0.  This is required to support async/await using the harmony-async-await flag and removing the requirement of babel for a simple task.
I would recommend using `nvm` to manage installed versions of node.

## Setup
`npm i`

## Running in dev mode

`npm run dev`

This starts the node process with `nodemon` to restart the server on any changes.

## Running Locally

`npm start`

Perform a request, eg:
`curl -i -H "Accept: application/json" "localhost:3000?city=glasgow"`

## Cli tool

This is a tiny app to print the forecast to your terminal.
`./cli.js <city>`

## Testing

`npm test`

## Improvements
- More Unit Tests!!! (time)
- Integration tests!!! (time)
- Cli tool formatting
- eslint (on pre-commit hook)
- code coverage
- Add support for metric / imperial scales
- neater printing with cli tool
