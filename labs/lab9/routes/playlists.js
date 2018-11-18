const express = require("express");
const { Track } = require("../models/track.js");
const { Utils } = require("../models/utils.js");
const { Playlist } = require("../models/playlist.js");
const { User } = require("../models/user.js");
const auth_cbs = require("./auth_cb");
const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();


router.get("/", 
auth_cbs.checkAuthRedirect,
(req, res) => {

    let playlists = null;
    let userId = req.query.user;
    if (!userId) playlists = Playlist.getAllCreated();
    else playlists = User.getById(userId)
        .then(user => Utils.getAllPlaylistFromUser(user))


    playlists
        .then(x => res.render('playlists', { playlists: x, user: req.user }))
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next();
        });
});



router.get("/new",
auth_cbs.checkAuthRedirect,
(req, res) => {
    Track.getAll()
        .then(tracks => {
            //console.log(tracks);
            if (!tracks) req.next();
            else res.render('playlists_new', { tracks: tracks, user: req.user });
        })
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next();
        })
});
router.post("/new",
auth_cbs.checkAuth,
(req, res) => {
    console.log("post request");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let userId = req.user._id;

    if (!desc) {
        res.sendStatus(400);
        return;
    }
    if (!tracks) tracks = [];
    else if (typeof tracks === "string")
        tracks = [tracks];

    console.log(tracks);
    console.log(userId);

    let newPlayList = new Playlist(userId, false, desc, tracks);
        Playlist.insert(newPlayList)
        .then(newId => {
            console.log(tracks);
            return Promise.all([newId, User.insertPlaylistId(userId, newId)])
        })
        .then(([newId, x]) => res.redirect(`/playlists/${newId}`))
        .catch(err => {
            console.log(`ERROR in POST ${req.baseUrl}: ${err.message}`);
            res.sendStatus(400);
        });
});

router.get("/:id", 
auth_cbs.checkAuthRedirect,
(req, res) => {
    let id = req.params.id;
    console.log(id);
    Playlist.getById(id)
        .populate("userRef")
        .populate("tracks")
        .exec()
        .then(playlist => {
            if (!playlist)
                return Promise.reject(new Error("No such playlist"));

            let isOwner = is_playlist_owner(req.user, playlist);

            console.log("Playlist: " + playlist);
            res.render("playlist", { playlist: playlist, user: req.user, isOwner: isOwner});
        })
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next()
        });
});

router.post("/:id",
auth_cbs.checkAuth,
(req, res, next) => {
    let id = req.params.id;
    Playlist.isRemoveble(id)
        .then(playlist => {
            if(!is_playlist_owner(req.user, playlist))
                return Promise.reject("User is not an owner of playlist");
            else return next();
        })
        .catch(err => {
            console.log(`ERROR : ${err.message}`);
            res.sendStatus(403);
        });
},
(req, res) =>{

    let id = req.params.id;
    console.log("PLAYLIST DELETE:" + id);


    Utils.removePlaylistIdFromUser(id)
        .then(() => Playlist.delete(id))
        .then(() => res.redirect("/playlists"))
        .catch(err => {
            console.log(`ERROR : ${err.message}`);
            res.sendStatus(400)
        });
});


router.get("/:id/update",
auth_cbs.checkAuthRedirect,
(req, res, next) => {
    let id = req.params.id;
    Playlist.isRemoveble(id)
        .then(playlist => {
            if(!is_playlist_owner(req.user, playlist))
                return Promise.reject("User is not an owner of playlist");
            else return next();
        })
        .catch(err => {
            console.log(`ERROR : ${err.message}`);
            res.sendStatus(403);
        });
},
(req, res) => {
    let id = req.params.id;
    console.log("PLAYLIST UPDATE:" + id);

   Promise.all([
        Playlist.getById(id)
            .populate({
                path: "tracks",
                model: "Track"
            })
            .exec(),
        Track.getAll()
    ])
    .then(([playlist, tracks]) => {
        if (!tracks || !playlist)
            return Promise.reject("Failed to lookup for data");

        let selected = playlist.tracks;
        let not_selected = formUnSelectedArr(tracks, playlist.tracks);
        console.log(selected);
        console.log("NOT SELECTED " + not_selected);

        res.render('playlist_upd', {
            tracks: tracks,
            selected: selected,
            not_selected: not_selected,
            playlist : playlist,
            user : req.user
        });
    })
    .catch(err => {
        console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
        req.next();
    })
});


router.post("/:id/update",
auth_cbs.checkAuth,
(req, res, next) => {
    let id = req.params.id;
    Playlist.isRemoveble(id)
        .then(playlist => {
            if(!is_playlist_owner(req.user, playlist))
                return Promise.reject("User is not an owner of playlist");
            else return next();
        })
        .catch(err => {
            console.log(`ERROR : ${err.message}`);
            res.sendStatus(403);
        });
},
(req, res)=> {
    console.log("post request");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let id = req.params.id;

    if (!desc) {
        res.sendStatus(400);
        return;
    }
    
    if (!tracks) tracks = [];
    else if (typeof tracks === "string")
        tracks = [tracks];

    console.log(tracks);
    Playlist.getById(id)
        .then(x => {
            if(!x) return Promise.reject(new Error("Not found"));
            x.desc = desc;
            x.tracks = tracks;
            return Playlist.update(x);
        })
        .then(() => res.redirect(`/playlists/${id}`))
        .catch(err => {
            console.log(`ERROR in POST ${req.baseUrl}: ${err.message}`);
            res.sendStatus(400);
        });
});



function formUnSelectedArr(tracks, selected){
    let arr = [];
    for(let track of tracks){
        let flag = false;
        for(let sel of selected){
            if(sel._id == track._id.toString()) {
                flag = true;
                break;
            }
        }
        if(!flag) arr.push(track);
    }
    return arr;
}

Array.prototype.diff = function(a) {
    return this.filter(function (i){
        return a.indexOf(i) === -1;
    });
};

function normalizeTrackList(tracks){
    let arr = [];

    for(let track of tracks){
        let newObj = {
            album: track.album,
            length: track.length,
            year: track.year,
            _id: track._id,
            uploadedListRef: track.uploadedListRef,
            author: track.author,
            name: track.name,
            location: track.location,
            trackImage: track.trackImage,
            addedAt: track.addedAt,
            __v: track.__v
        };
        arr.push(newObj);
    }
    return arr;
}
function is_playlist_owner(user, playlist){
    return playlist.userRef.toString() == user._id.toString()
        || playlist.userRef._id.toString() == user._id.toString()
        || user.role;
}


module.exports = router;