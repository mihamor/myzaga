const express = require("express");
const {Track} = require("../models/track.js");
const {Playlist} = require("../models/playlist.js");
const {User} = require("../models/user.js");

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

router.get("/new", function(req, res){ 
    Track.getAll()
        .then((x) => Promise.all([x, User.getAll()]))
        .then(([tracks, users]) => {
            //console.log(tracks);
            if(!tracks) req.next();
            else res.render('playlists_new', {tracks : tracks, users: users});
        })
        .catch(err => {
            console.log(err.message)
            req.next();
        })
});
router.post("/new", function(req, res){ 
    console.log("post request");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let userId = req.body.user;

    if(!tracks || !userId || ! desc){
        res.sendStatus(400);
        return;
    }
    if(typeof tracks === "string") 
        tracks = [tracks];    
        
    console.log(tracks);
    console.log(userId);


    let newPlayList = new Playlist(userId, false, desc, tracks);


    User.isExist(userId)
    .then(x => {
        if(x) return Promise.resolve()
        else return Promise.reject(new Error("Invalid input"))
    })
    .then(() => Playlist.insert(newPlayList))
        .then(newId => {

            console.log(tracks);

            if(tracks && tracks.length != 0)
            for(let i = 0, p = Promise.resolve(); i < tracks.length; i++){
                p = p.then(() => Track.getById(tracks[i]))
                .then(x => x[0]).then( x => {
                    //console.log(tracks[i]);
                    x.playlistRef.push(newId)
                    console.log(x);
                    return x;
                })
                .then(x => Track.update(x))
                .catch(err => {console.log("Updating track error: " + err.message);});
            }
            return Promise.all([newId, User.getById(userId).then(x => x[0])]);
        })
        .then(([newId, user]) => {
            user.custom_playlists.push(newId)
            console.log(user);
            return Promise.all([newId,User.update(user)]);
        })
        .then(([newId, x]) => res.redirect(`/playlists/${newId}`))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
});


module.exports = router;