const {Storage}  = require('./storage.js');

class Track extends Storage{
  
  static check_params(x) {
    return valid_number(x.id)
        && valid_string(x.author)
        && valid_string(x.name)
        && valid_string(x.location)
        && valid_string(x.trackImage)
        && valid_number(x.length)
        && valid_number(x.year)
        && valid_string(x.addedAt)
        && valid_string(x.album);
  }

  constructor(id, author, name, album, location, length, year, trackImage, addedAt = new Date().toISOString()) {
    super();
    this.id = id; // number
    this.author = author; //string
    this.album = album; //string
    this.name = name; // string
    this.location = location;  // string
    this.length = length; //number
    this.year = year; //number
    this.trackImage = trackImage;
    this.addedAt = addedAt; //date
  }
};

function valid_number(num) {
  return typeof num === 'number'
      && !isNaN(num);
}
function valid_string(str){
  return typeof str === 'string'
  && str.length != 0;
}
module.exports = { Track };


