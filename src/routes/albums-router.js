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
      return response.json(savedAlbum);
    })
    .catch(next);
});

albumsRouter.get('/api/albums/:id', (request, response, next) => {
  return Album.findById(request.params.id)
    .then((album) => {
      if (album) {
        logger.log(logger.INFO, 'Responding with a 200 status code and an album');
        return response.json(album);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Album not found');
      return next(new HttpError(404, 'Album not found'));
    })
    .catch(next);
});

albumsRouter.delete('/api/albums/:id', (request, response, next) => {
  return Album.findByIdAndDelete(request.params.id)
    .then((album) => {
      if (album) {
        logger.log(logger.INFO, 'Responding with a 200 status code and an album');
        return response.json(album);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Album not found');
      return next(new HttpError(404, 'Album not found'));
    })
    .catch(next);
});

// albumsRouter.put('/api/albums/:id', jsonParser, (request, response, next) => {
//   logger.log(logger.INFO, `Trying to update an object with id ${request.params.id}`);
//
//   if (storageByHash[request.params.id]) {
//     logger.log(logger.INFO, 'We found the right album to update');
//     if (request.body.title) {
//       storageByHash[request.params.id].title = request.body.title;
//     }
//     if (request.body.year) {
//       storageByHash[request.params.id].year = request.body.year;
//     }
//     return response.json(storageByHash[request.params.id]);
//   }
//   return next(new HttpError(404, 'The album was not found'));
// });
