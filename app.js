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
let http = require('http').Server(app);
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const config = require("./config");
const cloudinary = require("cloudinary");
const session = require('express-session');
const io = require('socket.io')(http);


// new imports
const passport = require('passport');
const cookieParser = require('cookie-parser');
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

require("./modules/passport")
// will open public directory files for http requests
const publicPath = path.join(__dirname, "client/build/");
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(busboyBodyParser({limit: '15mb'}));
app.use(cookieParser());

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
       http.listen(config.port, function() { console.log('Server is ready\n' + publicPath); });
    })
    .catch((err) => console.log("ERROR: " + err.message));

// app.get("/", (req, res) => {
//     res.render('index',{ user: req.user});
// });


app.get('/data/fs/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(`get file ${fileName}`);
    fs.exists(fileName, (err) => {
        if(err) console.log(err.message);
        else res.sendFile(path.join(__dirname, `data/fs/${fileName}`));
    });
});


// const adminRouter = require("./routes/admin_menu");
// app.use("/admin_menu", adminRouter);

function enableCors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
}


const authRouter = require("./routes/auth");
app.use("/auth", enableCors, authRouter);

const admin_menu = require("./routes/admin_menu");
app.use("/admin_menu", enableCors, admin_menu);

const apiV1= require("./routes/apiv1");
app.use("/api/v1", apiV1);
const apiV2= require("./routes/apiv2");
app.use("/api/v2", apiV2);
const apiV3= require("./routes/apiv3");
app.use("/api/v3", enableCors, apiV3);

app.get("*", (req, res) => {
    //res.status(404);
    res.sendFile(process.cwd() + '/client/build/index.html');
});


io.on('connection', function(socket){
    console.log("GOT NEW CONNECTION");
    let currTrack = 'default';
    socket.on('ontrack', (trackId) => {
        console.log("JOINING "+ trackId);
        currTrack = trackId;
        socket.join(trackId); 
    });
    socket.on('leaveTrack', (trackId) => {
        console.log("LEAVING "  + trackId)
        currTrack = null;
        socket.leave(trackId); 
     });
    socket.on('sendcomment',async ({commentText, id, user}) => {
        if(!currTrack) {
            console.log("ERROR");
            return;
        }
        console.log('comment sended '+ commentText);
        console.log("POST NEW COMMENT");
        let trackId = id;
        let userId = user;
        let content = commentText;
    
        console.log(content);
        console.log(trackId);
        try{
            //if(!check_body_comment(req.body)) throw new Error("Bad request");
            let comment = new Comment(content, userId);
    
            const isExist = await Track.isExist(trackId);
            const userPop = await User.getById(userId);
            if(!isExist || !userPop) throw new Error("No such entity");
            let newId = await Comment.insert(comment);
            await Track.insertComment(trackId, newId);
    
            //comment._id = newId;
            //comment.user = userPop;
            let newTrack = await Utils.getPopulatedTrack(trackId);
            io.sockets.in(currTrack).emit('successComment', newTrack);
        }catch(error) {
            console.log(error);
            io.sockets.in(currTrack).emit('failedComment', error);
        }
    });

    socket.on('disconnect', function () {

        console.log('USER DISCONNECTED');
      });
    //socket.on('sendcomment', ({commentText, id, user}) => {
    //   console.log('comment sended '+ commentText);
    //});
});