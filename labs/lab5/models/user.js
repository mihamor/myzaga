const {Storage} = require('./storage.js');
const {Playlist} = require('./playlist.js');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


const Schema = mongoose.Schema;


const UserSchema = new Schema({
  login: {type: String, required: true },
  fullname: {type: String, default: "None" },
  role: {type: Number, required: true },
  registeredAt: {type: Date, default: Date.now },
  avaUrl: {type: String, required: true },
  bio: {type: String, default: "None" },
  isDisabled: {type: Boolean, default: false },
  uploaded_tracks: {type: Schema.Types.ObjectId, ref: 'Playlist'},
  custom_playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}]
});

const UserModel = mongoose.model('User', UserSchema);



class User extends Storage{
  

  static this_model(){
    return UserModel;
  }

  static insert(ent){
    if(this.check_params(ent)) 
        return Promise.reject(new Error(""))
    let PlaylistModel = Playlist.this_model();
    let newUser = new UserModel(ent);
    console.log(newUser._id);
    let playlist = new Playlist(newUser._id, true, `Uploaded tracks for user ${newUser.login}`);
    let newPlaylist = new PlaylistModel(playlist)
    newUser.uploaded_tracks = newPlaylist._id;
   
    return newPlaylist
    .save()
    .then((x) => newUser.save())
    .then(x => x._id);
  }

  static insertPlaylistId(userId, plid){
     this.getById(userId)
        .then(x => x[0])
        .then(user => {
            user.custom_playlists.push(plid)
            return User.update(user);
        })
  }

  static removePlaylistId(plid){
    return Playlist.getById(plid)
      .populate({
        path: "userRef",
        model: "User"
      })
      .exec()
      .then(x => x[0].userRef)
      .then(user => {
        console.log(user);
        let newUser = new this(user._id, user.login, user.fullname, user.role, user.avaUrl, user.bio, user.uploaded_tracks, user.isDisabled, user.registeredAt);
        newUser.custom_playlists = removeItemFromArr(user.custom_playlists, plid);
        console.log(newUser);
        return this.update(newUser)
      });
  }


  static check_params(x) {
    return typeof x.login === 'string'
        && typeof x.bio === 'string'
        && typeof x.fullname === 'string'
        && typeof x.avaUrl === 'string'
        && valid_number(x.role)
        && typeof x.isDisabled === 'boolean';
  }

  constructor(id, login, fullname, role, avaUrl, bio, uploaded_tracks, isDisabled=false, registeredAt= new Date().toISOString()) {
    super();
    this._id = id; // number
    this.login = login;  // string
    this.fullname = fullname;  // string
    this.role = role; // number
    this.registeredAt = registeredAt; // string
    this.avaUrl = avaUrl; // string
    this.bio = bio //string
    this.isDisabled = isDisabled; // boolean
    this.uploaded_tracks = uploaded_tracks;
    this.custom_playlists = [];
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



module.exports = {User};
