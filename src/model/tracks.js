'use strict';

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const TrackList = require('./albums');

const trackListSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  trackList: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'trackList',
  },
});

function trackListTrackPreHook(done) {
  return TrackList.findById(this.trackList)
    .then((trackListFound) => {
      if (!trackListFound) {
        throw new HttpError(404, 'Track list Not Found');
      }
      trackListFound.trackList.push(this._id);
      return trackListFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
}

const trackListTrackPostHook = (document, done) => {
  return TrackList.findById(document.trackList)
    .then((trackListFound) => {
      if (!trackListFound) {
        throw new HttpError(500, 'Track List Not Found');
      }
      trackListFound.trackListTrack = trackListFound.trackListTrack
        .filter((trackListTrack) => {
          return trackListTrack._id.toString() !== document._id.toString();
        });
      return trackListFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
};

trackListSchema.pre('save', trackListTrackPreHook());
trackListSchema.post('remove', trackListTrackPostHook());

module.exports = mongoose.model('trackList', trackListSchema);
