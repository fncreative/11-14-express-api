'use strict';

const faker = require('faker');
const Album = require('../../model/albums');

const albumMock = module.exports = {};

albumMock.pCreateAlbumMock = () => {
  return new Album({
    title: faker.lorem.words(3),
    year: faker.random.number(4),
  }).save();
};

albumMock.pCleanAlbumMocks = () => {
  return Album.remove({});
};
