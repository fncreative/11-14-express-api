'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const trackListTrackMock = require('./lib/trackList-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/track-list`;

describe('/api/track-list', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(trackListTrackMock.pCleanTrackListTrackMocks());

  test('PUT should respond with 200 status and an updated item', () => {
    let savedTrackListMock;
    return trackListTrackMock.pCreateTrackListMock()
      .then((mock) => {
        savedTrackListMock = mock;
        return superagent.put(`${API_URL}/${mock.trackListTrack._id}`)
          .send({
            title: 'I am an updated track',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.track).toEqual(savedTrackListMock.trackListTrack.track);
        expect(response.body.title).toEqual('I am the updated album title');
        expect(response.body.trackList.toString())
          .toEqual(savedTrackListMock.trackList._id.toString());
      });
  });
});
