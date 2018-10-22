const express = require("express");
const {Playlist} = require("../models/playlist.js");

const router = express.Router();
Playlist.setStoragePath("./data/users.json");

router.get("/", function(req, res){
    Playlist.getAll()
        .then(x => res.render('playlists',{playlists : x}))
        .catch(err => {
            console.log(err.message);
            req.next();
        });
});
router.get("/:id", function(req, res){
    let id = req.params.id;
    console.log(id);
    Playlist.getById(id)
        .populate("tracks")
        .exec()
        .then(playlists => playlists[0])
        .then(playlist => {
            console.log(playlist);
            if(!playlist) 
                return Promise.reject("No such playlist");
            res.render("playlist", playlist)
        })
        .catch(err => req.next(err));
});

module.exports = router;