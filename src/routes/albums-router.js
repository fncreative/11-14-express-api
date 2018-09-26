'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Album = require('../model/albums');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const albumsRouter = module.exports = new express.Router();

const storageById = [];
const storageByHash = {};

albumsRouter.post('/api/albums', jsonParser, (request, response, next) => {
  if (!request.body) {
    return next(new HttpError(400, 'body is required'));
  }
  if (!request.body.title) {
    return next(new HttpError(400, 'a title is required'));
  }

  if (!request.body.year) {
    return next(new HttpError(400, 'a year is required'));
  }
  const album = new Album(request.body.title, request.body.year);
  storageById.push(album.id);
  storageByHash[album.id] = album;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json abject');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);
  return response.json(album);
});

albumsRouter.get('/api/albums/:id', (request, response, next) => {
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The note was not found'));
});

albumsRouter.delete('/api/albums/:id', (request, response, next) => {
  logger.log(logger.INFO, `Trying to delete an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the right album to remove');
    const indexToRemove = storageById.indexOf(request.params.id);
    storageById.splice(indexToRemove, 1);
    delete storageByHash[request.params.id];
    return response.sendStatus(204);
  }
  return next(new HttpError(404, 'The album was not found'));
});

albumsRouter.put('/api/albums/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Trying to update an object with id ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the right album to update');
    if (request.body.title) {
      storageByHash[request.params.id].title = request.body.title;
    }
    if (request.body.year) {
      storageByHash[request.params.id].year = request.body.year;
    }
    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The album was not found'));
});
