const {Storage}  = require('./storage.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    desc: {type: String, default:"None"},
    isUserUploads: {type: Boolean, default:false},
    userRef: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tracks: [{type: Schema.Types.ObjectId, ref: "Track"}]
});

const PlaylistModel = mongoose.model('Playlist', PlaylistSchema);


class Playlist extends Storage{
  
  static check_params(x) {
    return valid_string(x.desc)
    && typeof x.isUserUploads === "boolean";
  }

  static this_model() {
    return PlaylistModel;
  }

  static getAllCreated(){
    return this.this_model().find({isUserUploads: false});
  }
  static getAllByUserId(id){
    return this.this_model().find({
      userRef: id,
      isUserUploads: false
    });
  }

  static isRemoveble(id){
    return this.getById(id)
      .then(x => x[0])
      .then(x => {
        if(x.isUserUploads) 
          return Promise.reject(new Error("Playlist is not removeble"));
        return Promise.resolve();
      });
  }

  static getAllByTrackId(id){
    return this.this_model().find({
      tracks: id,
    });
  }

  static removeTrackFromAll(id){
    this.getAllByTrackId(id)
      .then(playlists => {
        let p = Promise.resolve();
        if(playlists.length !== 0)
        for(let i = 0; i < playlists.length; i++){
            let playlist = playlists[i];
            playlist.tracks = removeItemFromArr(playlist.tracks, id);
            console.log(playlist);
            p = p.then(() => Playlist.update(playlist));
        }
        return p;
    });
  }

  constructor(userRef, isUserUploads, desc, tracks = []) {
    super();
    this.userRef = userRef;
    this.isUserUploads = isUserUploads;
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

function removeItemFromArr(arr, item){
  let index = arr.indexOf(item);
  if(index > -1){
      arr.splice(index, 1);
  }
  return arr;
}

module.exports = { Playlist };


