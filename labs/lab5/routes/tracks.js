const express = require("express");
const {Track} = require("../models/track.js");
const {User} = require("../models/user.js");
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
    const tracksPerPage = 4;

    Track.getAll()
        .then(tracks =>{
            //console.log(tracks);
            let arr_after_search = search_throgh_arr(tracks, search_str);
            let p_tracks = formItemsPage(arr_after_search, tracksPerPage, page);
            let next_page = page * tracksPerPage < arr_after_search.length ? page + 1 : 0;
            let prev_page = page - 1;
            let page_count = Math.trunc(tracks.length / tracksPerPage + 1)
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
    let userId = req.body.userId;
    console.log(userId);
    let name = req.body.name;
    let album = req.body.album;
    if(!req.files) {
        res.sendStatus(400);
        return;
    }
    let track_bin = req.files.track;
    let image_bin = req.files.image;
    let length = req.files.track.size;
    let year = parseInt(req.body.year);

    console.log(req.files.track);

    let rand_name = randomstring.generate();
    let location = `/data/fs/${rand_name}.${getFileExt(track_bin.name)}`;
    let trackImage = `/data/fs/${rand_name}.${getFileExt(image_bin.name)}`;
    console.log(location);
    console.log(trackImage);
    let track_path = path.join(__dirname, `../${location}`);
    let image_path = path.join(__dirname, `../${trackImage}`);


    User.getById(userId)
        .then(x => x[0])
        .then(x => x.uploaded_tracks)
        .then(x => {
            let track = new Track(x, author, name, album, location, length, year, trackImage);
            console.log(track);
            return Promise.all([Track.insert(track), x]);
        })
        .then(([newId, plref]) => {
            return Playlist.getById(plref)
                .then(x => x[0])
                .then(x => {
                    x.tracks.push(newId);
                    console.log(x);
                    return Playlist.update(x);
                })
                .then(() => newId)
        })
        .then(newId => {
            return Promise.all([
                newId,
                fs.writeFile(image_path, 
                Buffer.from(new Uint8Array(image_bin.data))),
                fs.writeFile(track_path, 
                Buffer.from(new Uint8Array(track_bin.data)))
            ]);
        })
        .then(([newId, p1, p2]) => {
            console.log('redirection to new track...');
            res.redirect(`/tracks/${newId}`);
            return newId;
        })
        .catch((err) => {
            console.log(err.message);
            req.next();
        });

    //let track = new Track(author, name, album, location, length, year, trackImage);
    //console.log(track);

   /* Track.insert(track)
        .then(newId => {
            return Promise.all([
                newId,
                fs.writeFile(image_path, 
                Buffer.from(new Uint8Array(image_bin.data))),
                fs.writeFile(track_path, 
                Buffer.from(new Uint8Array(track_bin.data)))
            ]);
        })
        .then(([newId, p1, p2]) => {
            console.log('redirection to new track...');
            res.redirect(`/tracks/${newId}`);
            return newId;
        })
        .then(newId => {return User.getById(userId)})
        .populate("downloaded_tracks")
        .exec()
        .then(x => {
            x.push(newId);
            return Playlits.update(x);
        })
        .catch((err) => {
            console.log(err.message);
            req.next();
        });*/
});
router.get("/:id", function(req, res){
    let id = req.params.id;
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
        .then(tracks => tracks[0])
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

router.post("/:id", function(req, res){
    let id = req.params.id;
    console.log("TRACK DELETE:" + id);
    Track.getById(id)
        .then(x => x[0])
        .then(x => x.uploadedListRef)
        .then(x => Playlist.getById(x))
        .then(x => x[0])
        .then(x => {
            let index = x.tracks.indexOf(id);
            x.tracks.splice(index, 1);
            return Playlist.update(x);
        })
        .then(() =>  Track.delete(id))
        .then(() => res.redirect("/tracks"))
        .catch(err => {
            console.log(err.message);
            res.sendStatus(400)
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

module.exports = router;