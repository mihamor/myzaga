const express = require("express");
const {User} = require("../models/user");
const {Utils} = require("../models/utils");
const {Track} = require("../models/track");
const {Comment} = require("../models/comment");
const {Playlist} = require("../models/playlist");
const mongoose = require("mongoose");
const auth_cbs = require("./auth_cb");
const passport = require('passport');

const router = express.Router();


router.get('/me',
passport.authenticate('basic', { session: false }),
(req, res) => {
    res.json(req.user);
});

router.get('/tracks',
passport.authenticate('basic', { session: false }),
async (req, res) => {

    
    let page = Number(req.query.page);
    let search_str = req.query.search;

    if(isNaN(page) || page < 1) page = 1;
    if(!search_str) search_str = "";
    console.log(req.url);
    const tracksPerPage = 3;
    try{
        let tracks = await Track.getAll();
        //console.log(tracks);
        let arr_after_search = Utils.search_throgh_arr(tracks, search_str);
        let p_tracks = Utils.formItemsPage(arr_after_search, tracksPerPage, page);
        let page_count = Math.ceil(arr_after_search.length / tracksPerPage);
        console.log(p_tracks);
        res.json({  tracks : p_tracks,
                    search_str : search_str,
                    page_count: page_count,
                    this_page: page });
    }catch(err){
        console.log(err.message); 
        res.status(400).json({err: err.message});
    }
});



router.get('/tracks/:id',
passport.authenticate('basic', { session: false }),
async (req, res)=>{
    let id = req.params.id;
    console.log("track/id");
    try {
        let track = await Utils.getPopulatedTrack(id);
        if(!track) throw new Error("No such track");

        console.log(track);
        const isOwner = is_track_owner(req.user, track);
        for(let comm of track.comments)
            if(is_comment_owner(req.user, comm))
                comm.owner = true;

        track.comments = track.comments.sort( (a , b) => {
            return b.addedAt - a.addedAt;
        });
        res.json({track: track, isOwner: isOwner})
    } catch (err) {
        console.log(err.message); 
        res.status(400).json({err: err.message});
    }
});


function is_comment_owner(user, comment){
    return comment.user._id.toString() == user._id.toString() || user.role;
}
function is_track_owner(user, track){
    return track.uploadedListRef.toString() == user.uploaded_tracks.toString()
        || track.uploadedListRef._id.toString() == user.uploaded_tracks.toString() 
        || user.role;
}


module.exports = router;