'use strict';

const faker = require('faker');
const albumMock = require('./album-mock');
const TrackListTrack = require('../../model/tracks');

const trackListTrackMock = module.exports = {};

trackListTrackMock.pCreateTrackListMock = () => {
  const trackMock = {};

  return albumMock.pCreateTrackListMock()
    .then((createdTrackListMock) => {
      trackMock.trackList = createdTrackListMock;

      return new TrackListTrack({
        title: faker.lorem.words(1),
        track: faker.lorem.words(1),
        trackList: createdTrackListMock.id,
      }).save();
    })
    .then((createdTrackListMock) => {
      trackMock.trackListTrack = createdTrackListMock;
      return trackMock;
    });
};

trackListTrackMock.pCleanTrackListTrackMocks = () => {
  return Promise.all([
    TrackListTrack.remove({}),
    trackListTrackMock.pCleanTrackListTrackMocks(),
  ]);
};
