const express = require("express");
const { User } = require("../models/user");
const { Utils } = require("../models/utils");
const { Track } = require("../models/track");
const { Comment } = require("../models/comment");
const { Playlist } = require("../models/playlist");
const mongoose = require("mongoose");
const auth_cbs = require("./auth_cb");
const passport = require('passport')
const router = express.Router();




router.get('/me',
auth_cbs.checkAuthApi,
(req, res) => {
    res.json(req.user);
});

router.get('/tracks',
auth_cbs.checkAuthApi,
async (req, res) => {

    let page = Number(req.query.page);
    let search_str = req.query.search;

    if (isNaN(page) || page < 1) page = 1;
    if (!search_str) search_str = "";
    console.log(req.url);
    const tracksPerPage = 3;
    try {
        let tracks = await Track.getAll();
        //console.log(tracks);
        let arr_after_search = Utils.search_throgh_arr(tracks, search_str);
        let p_tracks = Utils.formItemsPage(arr_after_search, tracksPerPage, page);
        let page_count = Math.ceil(arr_after_search.length / tracksPerPage);
        console.log(p_tracks);
        res.json({
            tracks: p_tracks,
            search_str: search_str,
            page_count: page_count,
            this_page: page
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});



router.get('/tracks/:id',
auth_cbs.checkAuthApi,
async (req, res) => {
    let id = req.params.id;
    console.log("track/id");
    try {
        let track = await Utils.getPopulatedTrack(id);
        if (!track) throw new Error("No such entity");

        console.log(track);
        //const isOwner = is_track_owner(req.user, track);
        for (let comm of track.comments)
            if (is_comment_owner(req.user, comm))
                comm.owner = true;

        track.comments = track.comments.sort((a, b) => {
            return b.addedAt - a.addedAt;
        });
        track.uploadedListRef.userRef.passhash = undefined;
        res.json(track);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.post("/tracks",
auth_cbs.checkAuthApi,
async (req, res) => {
    try {
        if (!check_body(req)) throw new Error("Bad request");

        let author = req.body.author;
        let user = req.user;
        let userPlaylistId = user.uploaded_tracks;
        let name = req.body.name;
        let album = req.body.album;
        let track_bin = req.files.track;
        let image_bin = req.files.image;
        let length = req.files.track.size;
        let year = parseInt(req.body.year);
        console.log(req.files);
        const isExist = await Playlist.isExist(userPlaylistId);
        if (!isExist) throw new Error("No such entity");

        let [location, trackImage] = await Promise.all([
            Utils.uploadBufferAsync(track_bin.data),
            Utils.uploadBufferAsync(image_bin.data)
        ]);

        let track = new Track(userPlaylistId, author, name, album, location.url, length, year, trackImage.url);
        track.location_id = location.public_id;
        track.trackImage_id = trackImage.public_id;
        console.log(track);

        let [newId, playlist] = await Promise.all([
            Track.insert(track),
            Playlist.getById(userPlaylistId)
        ]);

        playlist.tracks.push(newId);
        console.log(playlist);
        await Playlist.update(playlist);

        track._id = newId;

        res.status(201).json(track);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});

router.delete("/tracks/:id",
auth_cbs.checkAuthApi,
async (req, res) => {
    let id = req.params.id;
    console.log("TRACK DELETE:" + id);

    try {
        let track =  await Track.getById(id);
        if(!track) throw new Error("No such entity");
        if(!is_track_owner(req.user, track)) throw new Error("Forbidden"); // @TESTTTTT
        let promise_arr = [];
        
        for(comm of track.comments){
            promise_arr.push(Comment.delete(comm));
        }
        await Promise.all([
            Promise.all(promise_arr),
            Utils.deleteFileAsync(track.trackImage_id),
            Utils.deleteFileAsync(track.location_id),
            Track.delete(id),
            Playlist.removeTrackFromAll(id)
        ]);
        res.json({track});
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.put("/tracks/:id",
auth_cbs.checkAuthApi,
async (req, res) => {
    
    let id = req.params.id;
    let author = req.body.author;
    let album = req.body.album;
    let name = req.body.name;
    let year = req.body.year;
    console.log("POST track/id/update");

    try{
        //if(!check_body_update(req)) throw new Error("Bad request");
        let track = await Track.getById(id);
        console.log(track);
        if(!track) throw new Error("No such entity");
        else if(!is_track_owner(req.user, track)) throw new Error("Forbidden");

        track.author = author ? author : track.author;
        track.name = name ? name : track.name;
        track.year = !isNaN(Number(year)) ? Number(year) : track.year;
        track.album = album ? album : track.album;
        const oldTrack = await Track.update(track);
        res.json(oldTrack);
    }catch(err){
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.get("/playlists", 
auth_cbs.checkAuthApi,
async (req, res) => {


    let page = Number(req.query.page);
    let search_str = req.query.search;

    if (isNaN(page) || page < 1) page = 1;
    if (!search_str) search_str = "";
    console.log(req.url);
    const playlistsPerPage = 3;


    try{
        let playlists = null;
        let userId = req.query.user;
        if (!userId) playlists = await Playlist.getAllCreated();
        else {
            const user = await User.getById(userId);
            playlists = await Utils.getAllPlaylistFromUser(user);
        }   

        let arr_after_search = Utils.search_throgh_playlists(playlists, search_str);
        let p_playlists = Utils.formItemsPage(arr_after_search, playlistsPerPage, page);
        let page_count = Math.ceil(arr_after_search.length / playlistsPerPage);
        console.log(p_playlists);
        res.json({
            playlists: p_playlists,
            search_str: search_str,
            page_count: page_count,
            ofUser : userId,
            this_page: page
        });
    }catch(err){
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.get("/playlists/:id", 
auth_cbs.checkAuthApi,
async (req, res) => {
    let id = req.params.id;
    console.log(id);
    try{ 
        const playlist = await Utils.getPopulatedPlaylist(id);
        if (!playlist) throw new Error("No such entity");
        console.log("Playlist: " + playlist);
        playlist.userRef.passhash = undefined;
        res.json(playlist);
    }catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.post("/playlists", 
auth_cbs.checkAuthApi,
async (req, res) => {
    console.log("NEW PLAYLIST");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let userId = req.user._id;

    console.log(tracks);
    if (!tracks) tracks = [];
    else if (typeof tracks === "string") tracks = [tracks];

    console.log(tracks);
    console.log(userId);

    try{
        if (!desc ) throw new Error("Bad request");

        for(let track of tracks){
            let isExist = await Track.isExist(track);
            if(!isExist) throw new Error("No such entity");
        }

        const newPlayList = new Playlist(userId, false, desc, tracks);
        const newId = await Playlist.insert(newPlayList);
        await User.insertPlaylistId(userId, newId);
        newPlayList._id = newId;
        res.status(201).json(newPlayList);
    }catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.delete("/playlists/:id", 
auth_cbs.checkAuthApi,
check_playlist_id,
async (req, res) =>{

    let id = req.params.id;

    try {
        let _ = await Utils.removePlaylistIdFromUser(id);
        let deletedPlaylist = await Playlist.delete(id);
        res.json(deletedPlaylist);
    }catch(err){
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.put("/playlists/:id", 
auth_cbs.checkAuthApi,
check_playlist_id,
async (req, res)=> {
    console.log("UPDATE PLAYLIST");
    let desc = req.body.desc;
    let tracks = req.body.tracks;
    let id = req.params.id;
    
    //if (!tracks) tracks = [];
    if (typeof tracks === "string")
        tracks = [tracks];

    console.log(tracks);

    try{
        //if(!desc) throw new Error("Bad request");
        let playlist = await Playlist.getById(id);
        if(tracks)
        for(const track of tracks){
            const isExist = await Track.isExist(track);
            if(!isExist) throw new Error("No such entity");
        }

        playlist.desc = desc ? desc : playlist.desc;
        playlist.tracks = tracks ? tracks : playlist.tracks;
        const oldPlaylist = await Playlist.update(playlist);
        res.json(oldPlaylist);
    }catch(err){
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.get("/users", 
auth_cbs.checkAuthApi,
auth_cbs.checkAdminApi,
async (req, res) => {

    let page = Number(req.query.page);
    let search_str = req.query.search;
    if (isNaN(page) || page < 1) page = 1;
    if (!search_str) search_str = "";
    console.log(req.url);
    const usersPerPage = 3;

    try{
        let users = await User.getAll();
        users.map(user => {user.passhash = undefined; return user;})

        let arr_after_search = Utils.search_throgh_users(users, search_str);
        let p_users = Utils.formItemsPage(arr_after_search, usersPerPage, page);
        let page_count = Math.ceil(arr_after_search.length / usersPerPage);
        console.log(p_users);
        res.json({
            users: p_users,
            search_str: search_str,
            page_count: page_count,
            this_page: page
        });
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});

router.get("/users/:id", 
auth_cbs.checkAuthApi,
async (req, res)=>{
    let id = req.params.id;
    console.log(id);
    try{
        let user = await User.getById(id)
        if(!user) throw new Error("No such entity");
        user.passhash = undefined;
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
});

router.put("/users/:id", 
auth_cbs.checkAuthApi,
async (req, res) => {
    let name = req.body.name;
    let bio = req.body.bio;
    let id = req.params.id;

    try{ 
        //if(!check_body_upd_user(req)) throw new Error("Bad request");
        let user = await User.getById(id);
        if(!user) throw new Error("No such entity");
        if(!is_user_owner(req.user, user)) throw new Error("Forbidden");
        if(req.files && req.files.ava && check_image_file(req.files.ava)){
            let ava_bin = req.files.ava;
            await Utils.deleteFileAsync(user.avaUrl.substring(user.avaUrl.lastIndexOf('/')+1))
            let result = await Utils.uploadBufferAsync(ava_bin.data);
            user.avaUrl = result.url;
        }else if(req.files && req.files.ava) throw new Error("Bad request");
        user.bio = bio ? bio : user.bio;
        user.fullname = name ? name : user.fullname;
        let oldUser = await User.update(user);
        res.json(oldUser);
    }catch (err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.post("/users",
async (req, res) => {
    const login = req.body.login;
    const pass = req.body.pass;

    try{
        if(!valid_user_info(login) || !valid_user_info(pass))
            throw new Error("Bad request");

        console.log(pass);
        const hashedPass = Utils.hash(pass);
        console.log(hashedPass);
        const user = new User(login, hashedPass, "None", 0, "/images/users/user_pic.png", "None");
    
        await User.isValidLogin(login)
        let newId =await Utils.insertUserWithPlaylist(user);
        user._id = newId;
        user.passhash = undefined;
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});

router.get("/comments", 
auth_cbs.checkAuthApi,
async (req, res) => {
    
    let page = Number(req.query.page);
    let search_str = req.query.search;
    if (isNaN(page) || page < 1) page = 1;
    if (!search_str) search_str = "";
    console.log(req.url);
    const commentsPerPage = 3;

    try{
        let comments = await Comment.getAll();

        let arr_after_search = Utils.search_throgh_comments(comments, search_str);
        let p_comments = Utils.formItemsPage(arr_after_search, commentsPerPage, page);
        let page_count = Math.ceil(arr_after_search.length / commentsPerPage);
        console.log(p_comments);
        res.json({
            comments: p_comments,
            search_str: search_str,
            page_count: page_count,
            this_page: page
        });
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});

router.get("/comments/:id", 
auth_cbs.checkAuthApi,
async (req, res) => {
    let id = req.params.id;
    console.log(id);
    try{ 
        const comment = await Comment.getById(id);
        if (!comment) throw new Error("No such entity");
        console.log("Comment: " + comment);
        res.json(comment);
    }catch(err) {
        console.log(err.message);
        res.status(400).json({ err: "No such entity" });
    }
});

router.post("/comments/:track_id", 
auth_cbs.checkAuthApi,
async (req, res) => {
    console.log("POST NEW COMMENT");
    let trackId = req.body.trackId;
    let userId = req.user._id;
    let content = req.body.commentText;

    try{
        if(!check_body_comment(req.body)) throw new Error("Bad request");
        let comment = new Comment(content, userId);

        const isExist = await Track.isExist(trackId);
        if(!isExist) throw new Error("No such entity");
        let newId = await Comment.insert(comment);
        await Track.insertComment(trackId, newId);

        comment._id = newId;
        res.json(comment);
    }catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});

router.delete("/comments/:id", 
auth_cbs.checkAuthApi,
async (req, res) => {
    console.log("DELETE COMMENT");
    let commentId = req.params.id;
    let trackId = req.body.trackId;

    try{
        if(!trackId) throw new Error("Bad request");


        let comment = await Comment.getById(commentId);
        if(!is_comment_owner(req.user, comment)) throw new Error("Forbidden");
        let track = await Utils.isTrackHasComment(trackId, commentId);
        track.comments = removeItemFromArr(track.comments, commentId);
        await Track.update(track);

        let oldComment = await Comment.delete(commentId);
        res.json(oldComment);
    }catch(err) {
        console.log(err.message);
        res.status(400).json({ err: err.message });
    }
});


router.use('/*',
(req, res) => {
    res.json({});
});


function is_comment_owner(user, comment) {
    return comment.user._id.toString() == user._id.toString() || user.role;
}
function is_track_owner(user, track) {
    return track.uploadedListRef.toString() == user.uploaded_tracks.toString()
    || track.uploadedListRef._id.toString() == user.uploaded_tracks.toString()
    || user.role;
}

function is_playlist_owner(user, playlist){
    return playlist.userRef.toString() == user._id.toString()
        || playlist.userRef._id.toString() == user._id.toString()
        || user.role;
}

function is_user_owner(user, profile){
    return profile._id.toString() == user._id.toString();
}



async function check_playlist_id(req, res, next){
    let id = req.params.id;
    try{
        let playlist = await Playlist.isRemoveble(id);
        console.log(playlist);
        if(!is_playlist_owner(req.user, playlist)) throw new Error("Forbidden");
        next();
    }catch(err){
        console.log(err.message);
        res.status(403).json({ err: err.message });
    }
}


function check_body(req) {
    return check_body_files(req.files) 
    && req.body.author 
    && req.body.name
    && req.body.album
    && req.body.year
    && !isNaN(Number(req.body.year));
}

function check_body_update(req) {
    return req.body.author 
    && req.body.name
    && req.body.album
    && req.body.year
    && !isNaN(Number(req.body.year));
}

function check_body_upd_user(req) {
    return req.body.name 
    && req.body.bio;
}


function check_body_comment(body){
    let content = body.commentText;
    return content
        && content.length != 0;
}


function check_body_files(files) {
    return files && files.track && files.image
    && files.track.mimetype === "audio/mpeg"
    && (files.image.mimetype === "image/png"
    || files.image.mimetype === "image/jpeg");
}

function check_image_file(file){
    return file.mimetype === "image/jpeg"
    || file.mimetype === "image/png";
}
function valid_user_info(str){
    return str && /^(\w{3,})+$/.test(str);
}

function removeItemFromArr(arr, item){
    let index = arr.indexOf(item);
    if(index > -1){
        arr.splice(index, 1);
    }
    return arr;
}

module.exports = router;