const express = require('express');
const path = require('path');
const fs = require("fs-promise");
const mustache = require('mustache-express');
const {User} = require('./models/user');
const {Track} = require('./models/track');
const {Utils} = require('./models/utils');
const {Comment} = require('./models/comment');
const {Playlist} = require('./models/playlist');
const app = express();
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const config = require("./config");
const cloudinary = require("cloudinary");


// new imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');







app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(async function(id, done) {

    try{
        let user = await User.getById(id)
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});


async function onLogin(username, password, done) {
    try{
        console.log(username, password);

        let hashedPass = Utils.hash(password);
        let user = await User.getByLoginAndHashPass(username, hashedPass);
        if(user) done(null, user);
        else done(null, false);
    } catch(err) {
        console.log(err.message);
        done(err, null);
    }
}

passport.use(new LocalStrategy(onLogin));
passport.use(new BasicStrategy(onLogin));





const viewsDir = path.join(__dirname, 'views');
app.engine('mst', mustache(path.join(viewsDir, 'partials')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'mst');


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
};
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

mongoose.connect(url, connectOptions)
    .then((x) => {
        console.log("Mongo database connected " + mongoose.connection);
       app.listen(config.port, function() { console.log('Server is ready\n' + publicPath); });
    })
    .catch((err) => console.log("ERROR: " + err.message));

app.get("/", function(req, res){
    res.render('index',{ user: req.user});
});

app.get('/data/fs/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(`get file ${fileName}`);
    fs.exists(fileName, (err) => {
        if(err) console.log(err.message);
        else res.sendFile(path.join(__dirname, `data/fs/${fileName}`));
    });
});

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const trackRouter = require("./routes/tracks");
app.use("/tracks", trackRouter);

const playlistRouter = require("./routes/playlists");
app.use("/playlists", playlistRouter);

const adminRouter = require("./routes/admin_menu");
app.use("/admin_menu", adminRouter);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const commentRouter = require("./routes/comments");
app.use("/comments", commentRouter);

const apiV1= require("./routes/api");
app.use("/api/v1", apiV1);


app.get("/about", function(req, res){
    res.render('about', { user: req.user});
});



app.use( (req, res) => {
    res.status(404);
    res.render('error', {error : ""});
});