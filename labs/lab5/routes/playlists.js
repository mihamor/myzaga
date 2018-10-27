const express = require("express");
const { Track } = require("../models/track.js");
const { Playlist } = require("../models/playlist.js");
const { User } = require("../models/user.js");

const ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();
Playlist.setStoragePath("./data/users.json");


router.get("/", function (req, res) {

    let playlists = null;
    let userId = req.query.user;
    if (!userId) playlists = Playlist.getAllCreated();
    else playlists = Playlist.getAllByUserId(userId);


    playlists
        .then(x => res.render('playlists', { playlists: x }))
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next();
        });
});


router.get("/new", function (req, res) {
    Track.getAll()
        .then((x) => Promise.all([x, User.getAll()]))
        .then(([tracks, users]) => {
            //console.log(tracks);
            if (!tracks) req.next();
            else res.render('playlists_new', { tracks: tracks, users: users });
        })
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next();
        })
});
router.post("/new", function (req, res) {
    console.log("post request");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let userId = req.body.user;

    if (!userId || !desc) {
        res.sendStatus(400);
        return;
    }
    if (!tracks) tracks = [];
    else if (typeof tracks === "string")
        tracks = [tracks];

    console.log(tracks);
    console.log(userId);

    let newPlayList = new Playlist(userId, false, desc, tracks);
    User.isExist(userId)
        .then(() => Playlist.insert(newPlayList))
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

router.get("/:id", function (req, res) {
    let id = req.params.id;
    console.log(id);
    Playlist.getById(id)
        .populate("userRef")
        .populate("tracks")
        .exec()
        .then(playlists => playlists[0])
        .then(playlist => {
            if (!playlist)
                return Promise.reject("No such playlist");

            console.log("Playlist: " + playlist);
            res.render("playlist", playlist)
        })
        .catch(err => {
            console.log(`ERROR in GET ${req.baseUrl}: ${err.message}`);
            req.next()
        });
});

router.post("/:id", function (req, res) {

    let id = req.params.id;
    console.log("PLAYLIST DELETE:" + id);


    Playlist.isRemoveble(id)
        .then(() => User.removePlaylistId(id))
        .then(() => Playlist.delete(id))
        .then(() => res.redirect("/playlists"))
        .catch(err => {
            console.log(`ERROR : ${err.message}`);
            res.sendStatus(400)
        });
});

module.exports = router;