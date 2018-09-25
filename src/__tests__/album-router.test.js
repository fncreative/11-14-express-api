'use strict';

process.env.PORT = 3000;

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}/api/albums`;

describe('api/albums', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('testing the post request', () => {
    test('this should respond with 200 status code and a new json mountain', () => {
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send({
          title: 'Around the Sun',
          year: '2004',
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Around the Sun');
          expect(response.body.year).toEqual('2004');
          expect(response.body.id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });
    test('this should respond with 400 status code if there is no name', () => {
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send({
          year: '1996′',
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });

  describe('testing the get methods', () => {
    test('this should respond with 200 status code and a json note if there is a matching id', () => {
      const originalRequest = {
        title: faker.lorem.words(3),
        year: faker.random.number(),
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((postResponse) => {
          originalRequest.id = postResponse.body.id;
          return superagent.get(`${API_URL}/${postResponse.body.id}`);
        })
        .then((getResponse) => {
          expect(getResponse.status).toEqual(200);
          expect(getResponse.body.timestamp).toBeTruthy();
          expect(getResponse.body.id).toEqual(originalRequest.id);
          expect(getResponse.body.title).toEqual(originalRequest.title);
        });
    });
  });

  describe('testing the delete requests', () => {
    test('this should respond with 200 status code', () => {
      const originalRequest = {
        title: faker.lorem.words(3),
        year: faker.random.number(),
      };
      return superagent.post(API_URL)
        .set('Content-Type', 'application/json')
        .send(originalRequest)
        .then((postResponse) => {
          originalRequest.id = postResponse.body.id;
          return superagent.delete(`${API_URL}/${postResponse.body.id}`);
        })
        .then((getResponse) => {
          expect(getResponse.status).toEqual(200);
        });
    });
  });
});
