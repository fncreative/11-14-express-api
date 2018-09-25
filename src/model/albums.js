'use strict';

const uuid = require('uuid/v1');

class Album {
  constructor(title, year) {
    this.id = uuid();
    this.timestamp = new Date();
    this.title = title;
    this.year = year;
  }
}

module.exports = Album;
