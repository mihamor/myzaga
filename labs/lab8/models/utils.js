const {Storage} = require('./storage.js');
const {Playlist} = require('./playlist.js');
const {User} = require('./user.js');
const {Comment} = require('./comment.js');
const {Track} = require('./track.js');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const util = require("util");
const config = require("../config")

const sha256 = require("sha256");

class Utils {

    static hash(str){
        let saltedStr = str + config.salt;
        return sha256(saltedStr).toString("hex");
    }

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

    static isTrackHasComment(trackId, commentId){
        if(!trackId || !commentId)
             return Promise.reject("Invalid args in isTrackHasComment")
        return Track.getById(trackId)
            .then(track => {
               commentId = commentId.toString();
               let coms = track.comments.map(x => x.toString());
               if(!coms.includes(commentId)) 
                return Promise.reject("Track doest not contain comments")

               return track;
            });

    }

    static getPopulatedPlaylist(id){
        return Playlist.getById(id)
        .populate("userRef")
        .populate("tracks")
        .exec();
    }

    static getPopulatedTrack(id){
        return Track.getById(id)
        .populate({
            path: "uploadedListRef",
            model: 'Playlist',
            populate : {
                path: "userRef",
                model: 'User',
            }
        })
        .populate({
            path: "comments",
            model: 'Comment',
            populate : {
                path: "user",
                model: 'User',
            }
        })
        .exec();
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
            let newUser = new User(user.login, user.passhash, user.fullname, user.role, user.avaUrl, user.bio, user.uploaded_tracks, user.isDisabled, user.registeredAt);
            newUser._id = user._id;
            newUser.custom_playlists = removeItemFromArr(user.custom_playlists, plid);
            console.log(newUser);
            return User.update(newUser);
          });
    }
    
    static formItemsPage(arr, itemsPerPage, page){
        let index_start = (page-1) * itemsPerPage;
        let index_end = (page) * itemsPerPage;
        index_end =  index_end < arr.length ? index_end : arr.length;
        return arr.slice(index_start, index_end);
    }
    
    static search_throgh_arr(arr, search_str){
        return search_throgh(arr, search_str, compare_to_track);
    }
    static search_throgh_users(arr, search_str){
        return search_throgh(arr, search_str, compare_to_user);
    }
    static search_throgh_comments(arr, search_str){
        return search_throgh(arr, search_str, compare_to_comment);
    }
    static search_throgh_playlists(arr, search_str){
      return search_throgh(arr, search_str, compare_to_playlist);
    }
}

function search_throgh(arr, search_str, cmp){
    let arr_after_search = [];
    if(!search_str) arr_after_search = arr;
    else {
        for(let track of arr){
            if(cmp(track, search_str)) 
                arr_after_search.push(track);
        }
    }
    return arr_after_search;
}


function compare_to_track(track, search_str){
    search_str = search_str.toLowerCase();
    return track.author.toLowerCase().includes(search_str)
    || track.name.toLowerCase().includes(search_str);
}


function compare_to_playlist(playlist, search_str){
    search_str = search_str.toLowerCase();
    return playlist.desc.toLowerCase().includes(search_str)
}


function compare_to_comment(comment, search_str){
    search_str = search_str.toLowerCase();
    return comment.content.toLowerCase().includes(search_str);
}
function compare_to_user(user, search_str){
    search_str = search_str.toLowerCase();
    return user.login.toLowerCase().includes(search_str)
    || user.fullname.toLowerCase().includes(search_str)
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
       // else if(result != "ok") callback(new Error("No file to delete"))
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