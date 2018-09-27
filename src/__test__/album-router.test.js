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
        expect(response.body.title).toEqual(originalRequest.content);
        expect(response.body.year).toEqual(originalRequest.content);
        expect(response.body._id.toString()).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test(' this should respond with a 200 status code and a json note if there is a matching id', () => {
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
  // describe('testing the get methods', () => {
  //   test('this should respond with 200 status code and a json album
  // if there is a matching id', () => {
  //     const originalRequest = {
  //       title: faker.lorem.words(3),
  //       year: faker.random.number(),
  //     };
  //     return superagent.post(API_URL)
  //       .set('Content-Type', 'application/json')
  //       .send(originalRequest)
  //       .then((postResponse) => {
  //         originalRequest.id = postResponse.body.id;
  //         return superagent.get(`${API_URL}/${postResponse.body.id}`);
  //       })
  //       .then((getResponse) => {
  //         expect(getResponse.status).toEqual(200);
  //         expect(getResponse.body.timestamp).toBeTruthy();
  //         expect(getResponse.body.id).toEqual(originalRequest._id);
  //         expect(getResponse.body.title).toEqual(originalRequest.title);
  //       });
  //   });
  // });

//   describe('testing the delete requests', () => {
//     test('this should respond with 204 status code', () => {
//       const originalRequest = {
//         title: faker.lorem.words(3),
//         year: faker.random.number(),
//       };
//       return superagent.post(API_URL)
//         .set('Content-Type', 'application/json')
//         .send(originalRequest)
//         .then((postResponse) => {
//           originalRequest.id = postResponse.body.id;
//           return superagent.delete(`${API_URL}/${postResponse.body.id}`);
//         })
//         .then((getResponse) => {
//           expect(getResponse.status).toEqual(204);
//         });
//     });
//   });
// });
});
