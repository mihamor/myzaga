const {Storage}  = require('./storage.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
  uploadedListRef: {type: Schema.Types.ObjectId, ref: "Playlist", required: true},
  author: {type: String, required: true },
  album: {type: String, default: "None" },
  name: {type: String, required: true },
  location: {type: String, required: true },
  location_id:{type: String, default: ""},
  length: {type: Number, default: 1 },
  year: {type: Number, default: 1 },
  trackImage: {type: String, required: true },
  trackImage_id: {type: String, default: ""},
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  addedAt: {type: Date, default: Date.now }
});

const TrackModel = mongoose.model('Track', TrackSchema);


class Track extends Storage{
  
  static check_params(x) {
    return valid_string(x.author)
        && valid_string(x.name)
        && valid_string(x.location)
        && valid_string(x.trackImage)
        && valid_number(x.length)
        && valid_number(x.year)
        && valid_string(x.album)
       // && valid_string(x.playlistRef)
  }

  static this_model() {
    return TrackModel;
  }

  constructor(uploadedListRef, author, name, album, location, length, year, trackImage, addedAt = new Date().toISOString()) {
    super();
    this.uploadedListRef = uploadedListRef; // object
    this.author = author; //string
    this.album = album; //string
    this.name = name; // string
    this.location = location;  // string
    this.location_id = "";
    this.length = length; //number
    this.year = year; //number
    this.trackImage = trackImage; //string
    this.trackImage_id = "";
    this.addedAt = addedAt; //date
    this.comments = [];
  }

  static insertComment(id, commentId){
    return this.getById(id)
      .then(track => {
        if(!track)
          return Promise.reject("No such track in insertComment()");
        track.comments.push(commentId);
        return Track.update(track);
      });

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


