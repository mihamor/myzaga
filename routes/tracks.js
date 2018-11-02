const express = require("express");
const {Track} = require("../models/track.js");
const {User} = require("../models/user.js");
const {Utils} =  require("../models/utils.js"); 
const {Playlist} = require("../models/playlist.js"); 
const randomstring = require("randomstring");
const fs = require('fs-promise');
const path = require('path');
const router = express.Router();
Track.setStoragePath("./data/tracks.json");


function is_valid_seacrch(str){
    return str;
}
router.get("/", function(req, res){

    let page = Number(req.query.page);
    let search_str = req.query.search;
    console.log(req.url);
    const is_valid_str = is_valid_seacrch(search_str);
    if(isNaN(page) 
    || page < 1 ){

        let query_search = !is_valid_str ? "" : `&search=${search_str}`;
        res.redirect(`/tracks?page=1${query_search}`);
        return;
    }
    const tracksPerPage = 3;

    Track.getAll()
        .then(tracks =>{
            //console.log(tracks);
            let arr_after_search = search_throgh_arr(tracks, search_str);
            let p_tracks = formItemsPage(arr_after_search, tracksPerPage, page);
            let next_page = page * tracksPerPage < arr_after_search.length ? page + 1 : 0;
            let prev_page = page - 1;
            let page_count = Math.ceil(arr_after_search.length / tracksPerPage);
            console.log(`render tracks pages: ${next_page} ${prev_page}`);
            res.render('tracks',  {tracks : p_tracks,
                                   next_page: next_page,
                                   prev_page : prev_page,
                                   search_str : search_str,
                                   page_count: page_count,
                                   this_page: prev_page+1});
        })
        .catch(err => {
            console.log(err.message); 
            req.next()
        });
});
router.get("/new", function(req, res){ 
    User.getAll()
        .then(users => {
            console.log(users);
            if(!users) req.next();
            else res.render('tracks_new', {users : users});
        })
        .catch(err => {
            console.log(err.message)
            req.next();
        })
});


router.post("/new", function(req, res){
    console.log("post request");
    let author = req.body.author;
    let userPlaylistId = req.body.userId;
    console.log(userPlaylistId);
    let name = req.body.name;
    let album = req.body.album;
    if(!check_body_files(req.files)) {
        res.sendStatus(400);
        return;
    }
    let track_bin = req.files.track;
    let image_bin = req.files.image;
    let length = req.files.track.size;
    let year = parseInt(req.body.year);

    console.log(req.files.track);

    Playlist.isExist(userPlaylistId)
    .then(() => Promise.all([
        Utils.uploadBufferAsync(track_bin.data),
        Utils.uploadBufferAsync(image_bin.data)
    ]))
    .then(([location, trackImage]) => {
        let track = new Track(userPlaylistId, author, name, album, location.url, length, year, trackImage.url);
        track.location_id = location.public_id;
        track.trackImage_id = trackImage.public_id;
        console.log(track);
        return track;
    })
    .then(track => Promise.all([
        Track.insert(track),
        Playlist.getById(userPlaylistId)
    ]))
    .then(([newId, playlist]) => {
        playlist.tracks.push(newId);
        console.log(playlist);
        return Playlist.update(playlist)
        .then(() => newId)
    })
    .then(newId => {
        console.log('redirection to new track...');
        res.redirect(`/tracks/${newId}`);
        return newId;
    })
    .catch((err) => {
        console.log(err.message);
        req.next();
    });


    /*    .then(newId => Promise.all([
            newId,
            fs.writeFile(image_path, 
            Buffer.from(new Uint8Array(image_bin.data))),
            fs.writeFile(track_path, 
            Buffer.from(new Uint8Array(track_bin.data)))
    ]))*/

});


router.get("/:id/update", function(req, res){
    let id = req.params.id;
    console.log("GET track/id/update");
    Track.getById(id)
        .then(track => {
            console.log(track);
            if(!track) 
                return Promise.reject(new Error("No such track"));
            else res.render("track_upd", track)
        })
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});

router.post("/:id/update", function(req, res){
    let id = req.params.id;
    let author = req.body.author;
    let album = req.body.album;
    let name = req.body.name;
    let year = req.body.year;
    console.log("POST track/id/update");
    Track.getById(id)
        .then(track => {
            console.log(track);
            if(!track) 
                return Promise.reject(new Error("No such track"));
            track.author = author;
            track.name = name;
            track.year = year;
            track.album = album;
            return Track.update(track);
        })
        .then(() => res.redirect(`/tracks/${id}`))
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});

router.get("/:id", function(req, res){
    let id = req.params.id;
    console.log("track/id");
    Track.getById(id)
        .populate({
            path: "uploadedListRef",
            model: 'Playlist',
            populate : {
                path: "userRef",
                model: 'User',
            }
        })
        .exec()
        .then(track => {
            console.log(track);
            if(!track) 
                return Promise.reject(new Error("No such track"));
            else res.render("track", track)
        })
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});

//const deleteFileAsync = util.promisify(cloudinary.uploader.destroy);

router.post("/:id", function(req, res){
    let id = req.params.id;
    console.log("TRACK DELETE:" + id);

    Track.getById(id)
        .then(track => Promise.all([
            Utils.deleteFileAsync(track.trackImage_id),
            Utils.deleteFileAsync(track.location_id)
        ]))
        .then(() => Track.delete(id))
        .then(() => Playlist.removeTrackFromAll(id))
        .then(() => res.redirect("/tracks"))
        .catch(err => {
            console.log(err.message);
            res.sendStatus(400);
        });
});


function formItemsPage(arr, itemsPerPage, page){
    let index_start = (page-1) * itemsPerPage;
    let index_end = (page) * itemsPerPage;
    index_end =  index_end < arr.length ? index_end : arr.length;
    return arr.slice(index_start, index_end);
}

function search_throgh_arr(arr, search_str){
    let arr_after_search = [];
    if(!search_str) arr_after_search = arr;
    else {
        for(let track of arr){
            if(compare_to_track(track, search_str)) 
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

function getFileExt(str){
    return str.split(".").pop();
}


function check_body_files(files){

    return files && files.track && files.image;


}

module.exports = router;