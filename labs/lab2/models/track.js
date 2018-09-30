const {Storage}  = require('./storage.js');

class Track extends Storage{
  
  static check_params(x) {
    return valid_number(x.id)
        && typeof x.author === 'string'
        && typeof x.name === 'string'
        && typeof x.location === 'string'
        && valid_number(x.length)
        && valid_number(x.year)
        && typeof x.addedAt === 'string'
        && typeof x.album === 'string';
  }

  constructor(id, author, name, album, location, length, year, addedAt = new Date().toISOString()) {
    super();
    this.id = id; // number
    this.author = author; //string
    this.album = album; //string
    this.name = name; // string
    this.location = location;  // string
    this.length = length; //number
    this.year = year; //number
    this.addedAt = addedAt; //date
  }
};

function valid_number(num) {
  return typeof num === 'number'
      && !isNaN(num);
}
module.exports = { Track };


