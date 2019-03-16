const express = require('express');
const path = require('path');
const fs = require("fs-promise");
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const config = require("./config");
const cloudinary = require("cloudinary");
const io = require('socket.io')(http);
const SocketHandler =  require("./modules/socket_handler");
const passport = require("passport");

app.use(passport.initialize());
require("./modules/passport")


const publicPath = path.join(__dirname, "client/build/");
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
       http.listen(config.port, function() { console.log('Server is ready\n' + publicPath); });
    })
    .catch((err) => console.log("ERROR: " + err.message));


app.get('/data/fs/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(`get file ${fileName}`);
    fs.exists(fileName, (err) => {
        if(err) console.log(err.message);
        else res.sendFile(path.join(__dirname, `data/fs/${fileName}`));
    });
});

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
    res.sendFile(process.cwd() + '/client/build/index.html');
});


const handler = new SocketHandler(io);
io.on('connection', handler.getCallback());
