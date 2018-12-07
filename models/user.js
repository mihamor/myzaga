const {Storage} = require('./storage.js');
const mongoose = require('mongoose');



const Schema = mongoose.Schema;


const UserSchema = new Schema({
  login: {type: String, required: true, unique: true },
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
        return Promise.reject(new Error("Invalid argument"))
    let newUser = new UserModel(ent);
    console.log(newUser._id);
    return newUser.save()
    .then(x => x._id);
  }

  static insertPlaylistId(userId, plid){
     this.getById(userId)
        .then(user => {
            user.custom_playlists.push(plid)
            return User.update(user);
        })
  }


  static check_params(x) {
    return typeof x.login === 'string'
        && typeof x.bio === 'string'
        && typeof x.fullname === 'string'
        && typeof x.avaUrl === 'string'
        && valid_number(x.role)
        && typeof x.isDisabled === 'boolean';
  }

  constructor(login, fullname, role, avaUrl, bio, uploaded_tracks, isDisabled=false, registeredAt= new Date().toISOString()) {
    super();
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


module.exports = {User};
