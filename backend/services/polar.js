'use strict';
const { Polar } = require('@polar-sh/sdk');

let _polar = null;
function getPolar() {
  if (!_polar) {
    _polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });
  }
  return _polar;
}

module.exports = { getPolar };
