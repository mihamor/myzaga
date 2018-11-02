const {Storage} = require('./storage.js');
const {Playlist} = require('./playlist.js');
const {User} = require('./user.js');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const util = require("util");


class Utils {

    static insertUserWithPlaylist(user){
        if(!User.check_params(user)) 
            return Promise.reject(new Error("Invalid arguments"))
        let PlaylistModel = Playlist.this_model();
        let UserModel = User.this_model();
        let newUser = new UserModel(user);
        console.log(newUser._id);
        let playlist = new Playlist(newUser._id, true, `Uploaded tracks for user ${newUser.login}`);
        let newPlaylist = new PlaylistModel(playlist)
        newUser.uploaded_tracks = newPlaylist._id;
       
        return newPlaylist
        .save()
        .then((x) => newUser.save())
        .then(x => x._id);
    }

    static getAllPlaylistFromUser(user){
        if(!User.check_params(user)) 
            return Promise.reject(new Error("Invalid arguments"));
        let PlaylistModel = Playlist.this_model();

        let arr = user.custom_playlists.map(ele => new mongoose.Types.ObjectId(ele._id));
        return PlaylistModel.find({
            _id: { $in: arr}
        });
    }
    static uploadBufferAsync(fileBuffer){
        return handle_file_upload_promised(fileBuffer);
    }

    static deleteFileAsync(id){
        return delete_file_promised(id);
    }

    static removePlaylistIdFromUser(plid){
        return Playlist.getById(plid)
          .populate({
            path: "userRef",
            model: "User"
          })
          .exec()
          .then(x => x.userRef)
          .then(user => {
            console.log("removePlaylistId" + user);
            let newUser = new User(user.login, user.fullname, user.role, user.avaUrl, user.bio, user.uploaded_tracks, user.isDisabled, user.registeredAt);
            newUser._id = user._id;
            newUser.custom_playlists = removeItemFromArr(user.custom_playlists, plid);
            console.log(newUser);
            return User.update(newUser);
          });
      }

}
const handle_file_upload_promised = util.promisify(handleFileUpload);
const delete_file_promised = util.promisify(deleteFile);
function handleFileUpload(fileBuffer, callback) {
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' },
        function (error, result) { 
            console.log(result, error)
            if (error) callback(error) 
            else callback(null, result);
        })
        .end(fileBuffer);
}
function deleteFile(id, callback){
    console.log(id);
    cloudinary.uploader.destroy(id, function (info) {
        let result, err;
        err = info.error;
        result = info.result;
        console.log(err, result);
        if(err) callback(err)
        else if(result != "ok") callback(new Error("No file to delete"))
        else callback (null, result);
    }, { resource_type: 'raw' });
}

function removeItemFromArr(arr, item){
    let index = arr.indexOf(item);
    if(index > -1){
        arr.splice(index, 1);
    }
    return arr;
}
  

module.exports = {Utils};