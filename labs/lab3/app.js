const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const {User} = require('./models/user.js')
const {Track} = require('./models/track.js')
const fs = require('fs');
const app = express();

const viewsDir = path.join(__dirname, 'views');
app.engine('mst', mustache(path.join(viewsDir, 'partials')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'mst');

User.setStoragePath("./data/users.json");
Track.setStoragePath("./data/tracks.json")

// will open public directory files for http requests
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.get("/", function(req, res){
    res.render('index');
});
app.get("/users", function(req, res){
    const users = User.getAll();
    res.render('users',  {users : users});
});
app.get("/users/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    let req_user = User.getById(id);
    if(req_user) res.render("user",req_user);
    else req.next();
});
app.get("/tracks", function(req, res){ 
    const tracks = Track.getAll();
    res.render('tracks', {tracks : tracks});
});
app.get("/tracks/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    let req_track = Track.getById(id);
    if(req_track) res.render("track", req_track);
    else req.next();
});
app.get("/about", function(req, res){
    res.render('about');
});


app.get("/api/users/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    let req_user = User.getById(id);
    if(req_user)res.json(req_user);
    else res.sendStatus(404);
});
app.get("/api/users", function(req, res){
    let users = User.getAll();
    res.json(users);
});


app.use( function(req, res){
    res.status(404);
    res.render('error');
});

app.listen(3001, function() { console.log('Server is ready\n' + publicPath); });