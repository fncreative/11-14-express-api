'use strict';

const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  track: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('TrackList', albumSchema);
