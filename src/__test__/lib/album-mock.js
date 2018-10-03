'use strict';

const faker = require('faker');
const AlbumList = require('../../model/albums');

const albumMock = module.exports = {};

albumMock.pCreateAlbumMock = () => {
  return new AlbumList({
    title: faker.lorem.words(1),
    track: faker.lorem.words(2),
  }).save();
};

albumMock.pCleanAlbumMock = () => {
  return AlbumList.remove({});
};
