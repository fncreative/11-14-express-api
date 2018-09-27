'use strict';


const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const albumMock = require('./lib/album-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/albums`;

describe('api/albums', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(albumMock.pCleanAlbumMocks);

  // POST test
  test('this should respond with 200 status code and a new json album', () => {
    const originalRequest = {
      title: faker.lorem.words(3),
      year: faker.random.number(),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(originalRequest.title);
        expect(response.body.year).toEqual(originalRequest.year);
        expect(response.body._id.toString()).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  // POST failure test
  test('this should respond with 400 status code if there is no album title', () => {
    const originalRequest = {
      content: faker.lorem.words(2),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  // Post failure test
  test('this should respond with 400 status code if there is no content at all', () => {
    const originalRequest = {
      title: faker.lorem.words(2),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  // Delete test
  test('this should respond with 204 status code', () => {
    const originalRequest = {
      title: faker.lorem.words(3),
      year: faker.random.number(),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest._id = postResponse.body._id;
        return superagent.delete(`${API_URL}/${postResponse.body._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
      });
  });
  // Delete failure test
  test('should respond with 400 if the delete route is not matched', () => {
    return superagent.delete(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status)
          .toEqual(404);
      });
  });
  // GET :id test
  test('this should respond with a 200 status code and a json album if there is a matching id', () => {
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
  // Get failure test
  test('should respond with 400 if the get route is not matched', () => {
    return superagent.get(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status)
          .toEqual(404);
      });
  });
  // PUT test
  test('should respond with 200 if we updated an album title and year', () => {
    let savedAlbumMock = null;
    return albumMock.pCreateAlbumMock()
      .then((createdAlbumMock) => {
        savedAlbumMock = createdAlbumMock;
        const newPutRequest = {
          title: faker.lorem.words(1),
          year: faker.random.number(),
        };
        return superagent.put(`${API_URL}/${createdAlbumMock._id}`)
          .send(newPutRequest)
          .then((putResponse) => {
            expect(putResponse.status).toEqual(200);
            expect(putResponse.body._id.toString()).toEqual(savedAlbumMock._id.toString());
            expect(putResponse.body.title).toEqual(newPutRequest.title);
            expect(putResponse.body.year).toEqual(newPutRequest.year);
          });
      });
  });
  // PUT failure test
  test('this should respond with a 404 error if there is not an id to update', () => {
    return superagent.put(`${API_URL}/davematthews`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
