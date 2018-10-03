'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Album = require('../model/albums.js');
const logger = require('../lib/logger');


const jsonParser = bodyParser.json();
const trackListRouter = module.exports = new express.Router();

trackListRouter.post('/api/album', jsonParser, (request, response, next) => {
  return new Album(request.body).save()
    .then((savedTrackList) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(savedTrackList);
    })
    .catch(next);
});
trackListRouter.get('/api/album/:id', (request, response, next) => {
  return Album.findById(request.params.id)
    .then((trackList) => {
      if (trackList) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a track list');
        return response.json(trackList);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. Track list not found');
      return next(new HttpError(404, 'Track list Not Found'));
    })
    .catch(next);
});
trackListRouter.delete('/api/album/:id', (request, response, next) => {
  return Album.findByIdAndDelete(request.params.id)
    .then((trackList) => {
      if (trackList) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a track list');
        return response.json(trackList);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code. track list not found');
      return next(new HttpError(404, 'Track List Not Found'));
    })
    .catch(next);
});
trackListRouter.put('/api/album/:id', jsonParser, (request, response, next) => {
  return Album.findById(request.params.id)
    .then((trackList) => {
      if (!request.body) {
        throw HttpError(400, 'a body is required');
      }
      if (!trackList) {
        throw HttpError(404, 'not found');
      }
      if (request.body.title) {
        trackList.set({
          title: `${request.body.title}`,
        });
      }
      if (request.body.tracks) {
        trackList.set({
          tracks: `${request.body.tracks}`,
        });
      }
      logger.log(logger.INFO, 'Responding with a 200 status code and a new album track listing');
      return trackList.save()
        .then(updatedTrackList => response.json(updatedTrackList))
        .catch(next);
    })
    .catch(next);
});
