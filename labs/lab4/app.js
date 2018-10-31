const express = require('express');
const path = require('path');
const mustache = require('mustache-express');
const {User} = require('./models/user.js')
const {Track} = require('./models/track.js')
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const randomstring = require("randomstring");

const viewsDir = path.join(__dirname, 'views');
app.engine('mst', mustache(path.join(viewsDir, 'partials')));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'mst');

User.setStoragePath("./data/users.json");
Track.setStoragePath("./data/tracks.json")

// will open public directory files for http requests
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(busboyBodyParser({limit: '15mb'}));


app.get("/", function(req, res){
    res.render('index');
});
app.get("/users", function(req, res){
    User.getAll((error, users) => {
        if (error) req.next();
        else res.render('users',  {users : users.items});
    });
});


app.get('/data/fs/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(`get file ${fileName}`);
    fs.exists(fileName, (err) => {
        if(err) console.log(err.message);
        else res.sendFile(path.join(__dirname, `data/fs/${fileName}`));
    });
});


app.get("/users/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    User.getById(id, (error, user) => {
        if (error || !user) req.next();
        else res.render("user", user );
    });
});

function is_valid_seacrch(str){
    return str && str.length != 0;
}
app.get("/tracks", function(req, res){

    let page = Number(req.query.page);
    let search_str = req.query.search;
    console.log(req.url);
    const is_valid_str = is_valid_seacrch(search_str);
    if(isNaN(page) 
    || page < 1 ){

        let query_search = !is_valid_str ? "" : `&search=${search_str}`;
        res.redirect(`/tracks?page=1${query_search}`);
        return;
    }
    const tracksPerPage = 3;
    Track.getAll((error, tracks) => {
        if (error) req.next();
        else {
            let arr_after_search = search_throgh_arr(tracks.items, search_str);
            let p_tracks = formItemsPage(arr_after_search, tracksPerPage, page);
            let next_page = page * tracksPerPage < arr_after_search.length ? page + 1 : 0;
            let prev_page = page - 1;
            let page_count = Math.ceil(arr_after_search.length / tracksPerPage);
            console.log(`${next_page} ${prev_page}`);
            res.render('tracks',  {tracks : p_tracks,
                                   next_page: next_page,
                                   prev_page : prev_page,
                                   search_str : search_str,
                                   this_page: prev_page+1,
                                   page_count: page_count});
        }
    }); 
});
app.get("/tracks/new", function(req, res){ 
    res.render('tracks_new');
});
app.post("/tracks/new", function(req, res){
    console.log("post request");
    let author = req.body.author;
    let name = req.body.name;
    let album = req.body.album;
    let track_bin = req.files.track;
    let length = req.files.track.size;
    let year = parseInt(req.body.year);
    let image_bin = req.files.image;


    console.log(req.files.track);

    let rand_name = randomstring.generate();
    let location = `/data/fs/${rand_name}.${getFileExt(track_bin.name)}`;
    let trackImage = `/data/fs/${rand_name}.${getFileExt(image_bin.name)}`;
    console.log(location);
    console.log(trackImage);
    let track_path = path.join(__dirname, `${location}`);
    let image_path = path.join(__dirname, `${trackImage}`);
    let track = new Track(0, author, name, album, location, length, year, trackImage);
    console.log(track);

    Track.insert(track, function(err, newId){
        if(err) {
            res.sendStatus(400);
            console.log(err);
        }
        else fs.writeFile(track_path, Buffer.from(new Uint8Array(track_bin.data)), (err) => {
            if(err) {
                console.log(err.message);
                 res.sendStatus(400);
            }else {
                fs.writeFile(image_path, Buffer.from(new Uint8Array(image_bin.data)), (err) =>{
                    if(err) {
                        console.log(err.message);
                         res.sendStatus(400);
                    }else {
                        console.log('redirection to new track...');
                        res.redirect(`/tracks/${newId}`);
                    }
                });
            }
        });
        
    });
})
app.get("/tracks/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    Track.getById(id, (error, track) => {
        if (error || !track) req.next();
        else res.render("track", track );
    });
});

app.post("/tracks/:id(\\d+)", function(req, res){
    let id = Number(req.params.id);
    Track.delete(id, (err)=>{
        if(err) res.sendStatus(400);
        else res.redirect("/tracks");
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

app.listen(3010, function() { console.log('Server is ready\n' + publicPath); });


function formItemsPage(arr, itemsPerPage, page){


    let index_start = (page-1) * itemsPerPage;
    let index_end = (page) * itemsPerPage;
    index_end =  index_end < arr.length ? index_end : arr.length;
    return arr.slice(index_start, index_end);
}

function search_throgh_arr(arr, search_str){
    let arr_after_search = [];
    
    if(!search_str) arr_after_search = arr;
    else {
        for(let track of arr){
            if(compare_to_track(track, search_str)) 
                arr_after_search.push(track);
        }
    }
    return arr_after_search;
}

function compare_to_track(track, search_str){

    search_str = search_str.toLowerCase();

    return track.author.toLowerCase().includes(search_str)
    || track.name.toLowerCase().includes(search_str);
}

function getFileExt(str){
    return str.split(".").pop();
}