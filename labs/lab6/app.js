const express = require('express');
const path = require('path');
const fs = require('fs-promise');
const mustache = require('mustache-express');
const {User} = require('./models/user.js');
const {Track} = require('./models/track.js');
const {Playlist} = require('./models/playlist.js');
const app = express();
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const config = require("./config");

const viewsDir = path.join(__dirname, 'views');
app.engine('mst', mustache(path.join(viewsDir, 'partials')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'mst');

Track.setStoragePath("./data/tracks.json")

// will open public directory files for http requests
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(busboyBodyParser({limit: '15mb'}));

const url = config.mongo_url;
const connectOptions = { 
    useNewUrlParser: true,
    useCreateIndex: true
}
mongoose.connect(url, connectOptions)
    .then((x) => {
        console.log("Mongo database connected " + mongoose.connection);
        //autoIncrement.initialize(mongoose.connection);
        //UserSchema.plugin(autoIncrement.plugin, 'User');
       //UserModel = mongoose.model('User', UserSchema);
        //TrackSchema.plugin(autoIncrement.plugin, 'Track');
       // TrackModel = mongoose.model('Track', TrackSchema);
       // console.log(TrackModel);

       app.listen(config.port, function() { console.log('Server is ready\n' + publicPath); });
    })
    .catch((err) => console.log("ERROR: " + err.message));

app.get("/", function(req, res){
    res.render('index');
});

app.get('/data/fs/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(`get file ${fileName}`);
    fs.exists(fileName, (err) => {
        if(err) console.log(err.message);
        else res.sendFile(path.join(__dirname, `data/fs/${fileName}`));
    });
});

const userRouter = require("./routes/users.js");
app.use("/users", userRouter);

const trackRouter = require("./routes/tracks.js");
app.use("/tracks", trackRouter);

const playlistRouter = require("./routes/playlists.js");
app.use("/playlists", playlistRouter);

app.get("/about", function(req, res){
    res.render('about');
});


app.get("/api/users/:id(\\d+)", function(req, res){

    let id = Number(req.params.id);
    User.getById(id)
        .then(track => {
            if(!track) res.sendStatus(404)
            else res.send(track);
        })
        .catch(err => {
            console.log(err.message);
            res.sendStatus(404);
        });
});
app.get("/api/users", function(req, res){
    User.getAll()
        .populate("downloaded_tracks")
        .exec()
        .then(users => res.send(users))
        .catch(err => res.sendStatus(404));
});

app.get("/api/users/test_add", (req, res)=>{

    let UserModel = User.this_model();
    let PlaylistModel = Playlist.this_model();
    let u = new User(0, "djigolo", "Sanek Chert", 0, "/images/users/user2.jpeg", "шо вы малые блин!");
    User.insert(u)
    .then(x => res.send(x))
    .catch(err => {
        console.log(err);
        req.next();
    });

});

app.get("/api/users/populated", (req, res)=>{
    let UserModel = User.this_model();
    UserModel.find()
    .populate("uploaded_tracks")
    .exec()
    .then(x => x.map(i => i.toJSON()))
    .then(x => res.json(x));

});


app.get("/api/playlists/test_add", (req, res)=>{
    
    let PlaylistModel = Playlist.this_model();
    let t = new Playlist("0", "Some desc", false);
    new PlaylistModel(t).save()
        .then(x => x.toJSON())
        .then(x => res.json(x));
});
app.get("/api/tracks/test_add", (req, res)=>{
    
    let TrackModel = Track.this_model();
    let t = new Track("Metallica", "shit", "shoto", ".", 12130, 20123, ",");
    new TrackModel(t).save()
        .then(x => x.toJSON())
        .then(x => res.json(x));
});


app.use( function(req, res){
    res.status(404);
    res.render('error', {error : ""});
});
