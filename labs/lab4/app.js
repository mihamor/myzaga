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
    User.getAll((error, users) => {
        if (error) req.next();
        else res.render('users',  {users : users.items});
    });
});
app.get("/users/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    User.getById(id, (error, user) => {
        if (error || !user) req.next();
        else res.render("user", user );
    });
});
app.get("/tracks", function(req, res){ 
    Track.getAll((error, tracks) => {
        if (error) req.next();
        else res.render('tracks',  {tracks : tracks.items});
    });
});
app.get("/tracks/new", function(req, res){ 
    res.render('tracks_new');
});

app.get("/tracks/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    Track.getById(id, (error, track) => {
        if (error || !track) req.next();
        else res.render("track", track );
    });
});
app.get("/about", function(req, res){
    res.render('about');
});


app.get("/api/users/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    User.getById(id, (error, user) => {
        if (error || !user) res.sendStatus(404);
        else res.send(user);
    });
});
app.get("/api/users", function(req, res){
    User.getAll((error, users) => {
        if (error) res.sendStatus(404);
        else res.send(users);
    });
});

app.use( function(req, res){
    res.status(404);
    res.render('error');
});

app.listen(3001, function() { console.log('Server is ready\n' + publicPath); });