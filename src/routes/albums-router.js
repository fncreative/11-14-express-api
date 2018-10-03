'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Album = require('../model/albums');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const albumsRouter = module.exports = new express.Router();


albumsRouter.post('/api/albums', jsonParser, (request, response, next) => {
  return new Album(request.body).save()
    .then((savedAlbum) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(savedAlbum);
    })
    .catch(error => next(error));
});
albumsRouter.put('/api/albums/:id', jsonParser, (request, response, next) => {
  const updateOptions = {
    runValidators: true,
    new: true,
  };
  return Album.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then((updatedAlbum) => {
      if (!updatedAlbum) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not locate the album to update'));
      }
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(updatedAlbum);
    })
    .catch(error => next(error));
});
