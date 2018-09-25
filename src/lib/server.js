'use strict';

const express = require('express');
const logger = require('./logger');
const albumRoutes = require('../routes/albums-router');

const app = express();

app.use(albumRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from default route (route was not found)');
  return response.sendStatus(404);
});

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  internalServer = app.listen(process.env.PORT, () => {
    logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
  });
};

server.stop = () => {
  internalServer.close(() => {
    logger.log(logger.INFO, 'The server is off.');
  });
};