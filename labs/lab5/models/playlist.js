const {Storage}  = require('./storage.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    desc: {type: String, default:"None"},
    userRef: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tracks: [{type: Schema.Types.ObjectId, ref: "Track"}]
});

const PlaylistModel = mongoose.model('Playlist', PlaylistSchema);


class Playlist extends Storage{
  
  static check_params(x) {
    return valid_string(x.desc);
  }

  static this_model() {
    return PlaylistModel;
  }

  constructor(userRef, desc, tracks = []) {
    super();
    this.userRef = userRef;
    this.desc = desc;
    this.tracks = tracks;

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
module.exports = { Playlist };


