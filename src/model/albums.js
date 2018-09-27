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
  year: {
    type: Number,
    required: true,
    minlength: 4,
  },
});

module.exports = mongoose.model('album', albumSchema);
