const axios = require('axios')

const { GARMIN_HOST, GARMIN_COMMON_PATH, GARMIN_COOKIE } = require('./config')

const request = function(options = {}) {
  const { method= 'GET', path= '/', body, query} = options;

  const data = {
    method,
    url: `${GARMIN_HOST}${GARMIN_COMMON_PATH}${path}`,
    headers: {
      cookie: GARMIN_COOKIE
    }
  }
  if (body) {
    data.body = body;
  }
  if (query) {
    data.params = query
  }
  return axios(data)
}

module.exports = {
  request
}