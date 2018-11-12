const express = require("express");
const {Track} = require("../models/track");
const {Comment} = require("../models/comment");

const {User} = require("../models/user");
const {Utils} =  require("../models/utils"); 
const {Playlist} = require("../models/playlist"); 
const randomstring = require("randomstring");
const fs = require('fs-promise');
const path = require('path');
const router = express.Router();

function is_valid_seacrch(str){
    return str;
}
router.get("/", 
(req, res, next)=>{
    if(!req.user){
        res.redirect("/auth/login");
    }else next();
},
(req, res)=>{

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
            let arr_after_search = Utils.search_throgh_arr(tracks, search_str);
            let p_tracks = Utils.formItemsPage(arr_after_search, tracksPerPage, page);
            let next_page = page * tracksPerPage < arr_after_search.length ? page + 1 : 0;
            let prev_page = page - 1;
            let page_count = Math.ceil(arr_after_search.length / tracksPerPage);
            console.log(`render tracks pages: ${next_page} ${prev_page}`);
            res.render('tracks',  {tracks : p_tracks,
                                   next_page: next_page,
                                   prev_page : prev_page,
                                   search_str : search_str,
                                   page_count: page_count,
                                   this_page: prev_page+1,
                                   user: req.user});
        })
        .catch(err => {
            console.log(err.message); 
            req.next()
        });
});
router.get("/new",(req, res, next)=>{
    if(!req.user){
        res.redirect("/auth/login");
    }else next();
},
(req, res) => { 
    res.render('tracks_new',{user: req.user});
});


router.post("/new", (req, res, next)=>{
    if(!req.user){
        res.sendStatus(401);
    }else next();
},
(req, res) => {
    console.log("post request");
    let author = req.body.author;

    let user = req.user;
    let userPlaylistId = user.uploaded_tracks;
    //console.log(userPlaylistId);
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

});


router.get("/:id/update", (req, res, next)=>{
    if(!req.user){
        res.redirect("/auth/login");
    }else next();
},
(req, res) => {
    let id = req.params.id;
    console.log("GET track/id/update");
    Track.getById(id)
        .then(track => {
            console.log(track);
            console.log(req.user);
            if(!track) 
                return Promise.reject(new Error("No such track"));
            else if(!is_track_owner(req.user, track))
                res.sendStatus(403);
            else res.render("track_upd", {track: track, user: req.user})
        })
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});

router.post("/:id/update",
(req, res, next)=>{
    if(!req.user){
        res.sendStatus(401);
    }else next();
},
(req, res) => {
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

router.get("/:id", (req, res, next)=>{
    if(!req.user){
        res.redirect("/auth/login");
    }else next();
},
(req, res)=>{
    let id = req.params.id;
    console.log("track/id");
    Utils.getPopulatedTrack(id)
        .then(track => {
            console.log(track);
            if(!track) 
                return Promise.reject(new Error("No such track"));
            else{

                const isOwner = is_track_owner(req.user, track);
                for(let comm of track.comments){
                    if(comm.user._id.toString() == req.user._id.toString() 
                    || req.user.role)
                        comm.owner = true;
                }
                track.comments = track.comments.sort( (a , b) => {
                    return b.addedAt - a.addedAt;
                });
                res.render("track", {track: track, user:req.user, isOwner: isOwner})
            }
        })
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});

//const deleteFileAsync = util.promisify(cloudinary.uploader.destroy);

router.post("/:id", (req, res, next)=>{
    if(!req.user){
        res.sendStatus(401);
    }else next();
},
(req, res) => {
    let id = req.params.id;
    console.log("TRACK DELETE:" + id);

    Track.getById(id)
        .then(track => {
            if(!is_track_owner(req.user, track))
                return Promise.reject(new Error("Forbidden"));
            return track;
        })
        .then(track => {
            let promise_arr = [];
            for(comm of track.comments){
                promise_arr.push(Comment.delete(comm));
            }
            return Promise.all([
                track,
                Promise.all(promise_arr)
            ]);
        })
        .then(([track, p]) => Promise.all([
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


function getFileExt(str){
    return str.split(".").pop();
}


function check_body_files(files){

    return files && files.track && files.image;


}

function is_track_owner(user, track){
    return track.uploadedListRef.toString() == user.uploaded_tracks.toString()
        || track.uploadedListRef._id.toString() == user.uploaded_tracks.toString() 
        || user.role;
}

module.exports = router;