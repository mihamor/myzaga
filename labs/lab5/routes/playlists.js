const express = require("express");
const {Playlist} = require("../models/playlist.js");

const router = express.Router();
Playlist.setStoragePath("./data/users.json");

router.get("/", function(req, res){
    Playlist.getAll()
        .populate()
        .exec()
        .then(x => res.render('playlist',{playlists : x}))
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});
router.get("/:id", function(req, res){
    let id = req.params.id;
    console.log(id);
    Playlist.getById(id)
        .populate("userRef")
        .populate("tracks")
        .exec()
        .then(playlists => playlists[0])
        .then(playlist => {
            if(!playlist) 
                return Promise.reject("No such playlist");

            console.log("Playlist: "+ playlist);
            res.render("playlist", playlist)
        })
        .catch(err => req.next());
});

module.exports = router;