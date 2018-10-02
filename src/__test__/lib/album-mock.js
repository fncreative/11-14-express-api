'use strict';

const faker = require('faker');
const AlbumList = require('../../model/albums');

const albumMock = module.exports = {};

albumMock.pCreateAlbumMock = () => {
  return new AlbumList({
    title: faker.lorem.words(10),
    year: faker.random.number(),
  }).save();
};

albumMock.pCleanAlbumMock = () => {
  return AlbumList.remove({});
};
