'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const Album = require('../model/albums');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const albumsRouter = module.exports = new express.Router();

const storageById = [];
const storageByHash = {};

albumsRouter.post('/api/albums', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/albums');

  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.year) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  const album = new Album(request.body.title, request.body.year);
  storageById.push(album);
  storageByHash[album.id] = album;
  return response.json(album);
});

albumsRouter.get('/api/albums/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing GET request on /api/albums');
  logger.log(logger.INFO, `Attempting to get an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found. Responding with json data.`);
    return response.json(storageByHash[request.params.id]);
  }

  logger.log(logger.INFO, 'That album does not exist in. Responding with a 404 status code.');
  return response.sendStatus(404);
});

albumsRouter.delete('/api/albums/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing DELETE request on /api/albums');
  logger.log(logger.INFO, `Attempting to delete an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, `The resource with id of ${request.params.id} has been found and removed.`);
    delete storageByHash[request.params.id];
    return response.sendStatus(204);
  }

  logger.log(logger.INFO, 'That album does not exist. Responding with a 404 status code.');
  return response.sendStatus(404);
});

albumsRouter.put('/api/albums', (request, response) => {
  logger.log(logger.INFO, `Processing a PUT request on /api/albums/${request.params.id}`);

  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.title) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.year) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }

  storageByHash[request.params.id] = {
    title: request.params.title,
    year: request.params.year,
  };
  return response.json(storageByHash[request.params.id]);
});
