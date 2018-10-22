const {Storage} = require('./storage.js');
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
  downloaded_tracks: {type: Schema.Types.ObjectId, ref: 'Playlist'}
});

const UserModel = mongoose.model('User', UserSchema);



class User extends Storage{
  

  static this_model(){
    return UserModel;
  }

  static check_params(x) {
    return valid_string(x.id)
        && typeof x.login === 'string'
        && typeof x.bio === 'string'
        && typeof x.fullname === 'string'
        && typeof x.avaUrl === 'string'
        && valid_number(x.role)
        && typeof x.registeredAt === 'string'
        && typeof x.isDisabled === 'boolean';
  }

  constructor(id, login, fullname, role, avaUrl, bio, downloaded_tracks, isDisabled=false, registeredAt= new Date().toISOString()) {
    super();
    this.id = id; // number
    this.login = login;  // string
    this.fullname = fullname;  // string
    this.role = role; // number
    this.registeredAt = registeredAt; // string
    this.avaUrl = avaUrl; // string
    this.bio = bio //string
    this.isDisabled = isDisabled; // boolean
    this.downloaded_tracks = downloaded_tracks;
   }
};

function valid_number(num) {
  return typeof num === 'number'
      && !isNaN(num);
}




module.exports = {User};
