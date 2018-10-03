'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const albumMock = require('./lib/album-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/albums`;

describe('/api/albums', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(albumMock.pCleanAlbumMock);

  test('should respond with 200 status code and a new json note', () => {
    const originalRequest = {
      title: faker.lorem.words(4),
      track: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.track).toEqual(originalRequest.track);
        expect(response.body.title).toEqual(originalRequest.title);
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body._id.toString()).toBeTruthy();
      });
  });
  test('should respond with 400 status code if there is no title', () => {
    const originalRequest = {
      content: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('should respond with 400 status code if there is no track', () => {
    const originalRequest = {
      title: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('should respond with 200 status code and a json album if there is a matching id', () => {
    let savedAlbumMock = null;
    return albumMock.pCreateAlbumMock()
      .then((createdAlbumMock) => {
        savedAlbumMock = createdAlbumMock;
        return superagent.get(`${API_URL}/${createdAlbumMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedAlbumMock._id.toString());
        expect(getResponse.body.title).toEqual(savedAlbumMock.title);
      });
  });
  test('should respond with 404 if the id is not found', () => {
    return superagent.get(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('should respond with 200 when the album is removed', () => {
    let savedAlbumMock = null;
    return albumMock.pCreateAlbumMock()
      .then((createdAlbumMock) => {
        savedAlbumMock = createdAlbumMock;
        return superagent.delete(`${API_URL}/${createdAlbumMock._id}`);
      })
      .then((deleteResponse) => {
        expect(deleteResponse.status).toEqual(200);

        expect(deleteResponse.body.timestamp).toBeTruthy();
        expect(deleteResponse.body._id.toString()).toEqual(savedAlbumMock._id.toString());
        expect(deleteResponse.body.title).toEqual(savedAlbumMock.title);
      });
  });
  test('should respond with 404 if the id cannot be found', () => {
    return superagent.delete(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('should respond with 204 if we updated an album and track list', () => {
    let savedAlbumMock = null;
    return albumMock.pCreateAlbumMock()
      .then((createdAlbumMock) => {
        savedAlbumMock = createdAlbumMock;
        const newPut = {
          title: faker.lorem.words(1),
          track: faker.lorem.words(1),
        };
        return superagent.put(`${API_URL}/${createdAlbumMock._id}`)
          .send(newPut)
          .then((putResponse) => {
            expect(putResponse.status).toEqual(200);
            expect(putResponse.body._id).toEqual(savedAlbumMock.id);
            expect(putResponse.body.title).toEqual(newPut.title);
            expect(putResponse.body.track).toEqual(newPut.track);
          });
      });
  });
  test('should respond with 404 if the id does not exist', () => {
    return superagent.put(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
