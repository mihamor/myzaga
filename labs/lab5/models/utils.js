const {Storage} = require('./storage.js');
const {Playlist} = require('./playlist.js');
const {User} = require('./user.js');



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



function removeItemFromArr(arr, item){
    let index = arr.indexOf(item);
    if(index > -1){
        arr.splice(index, 1);
    }
    return arr;
}
  

module.exports = {Utils};