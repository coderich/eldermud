const API = jest.requireActual('../AppService');

API.timeout = () => Promise.resolve();

module.exports = API;
