require('dotenv').config()
const config = require('12factor-config');

const cfg = config({
  PG_USER: {
    env      : 'PG_USER',
    type     : 'string',
  },
  PG_HOST: {
    env      : 'PG_HOST',
    type     : 'string',
  },
  PG_DATABASE: {
    env      : 'PG_DATABASE',
    type     : 'string',
  },
  PG_PASSWORD: {
    env      : 'PG_PASSWORD',
    type     : 'string',
  },
  PG_PORT: {
    env      : 'PG_PORT',
    type     : 'integer',
  },
  SERVER_PORT: {
    env      : 'SERVER_PORT',
    type     : 'integer',
    default  : 5000,
  },
  HEROKU_PORT: {
    env      : 'PORT',
    type     : 'integer',
  },
  DATABASE_URL: {
    env      : 'DATABASE_URL',
    type     : 'string',
  },
  NODE_ENV: {
    env      : 'NODE_ENV',
    type     : 'string',
  },
  SIMULATE_PRODUCTION: {
    env      : 'SIMULATE_PRODUCTION',
    type     : 'boolean',
    default  : false,
  },
  PRODUCTION_URL: {
    env      : 'PRODUCTION_URL',
    type     : 'string',
    default  : 'https://coyote-point-wind.herokuapp.com'
  },
});

module.exports = cfg;
