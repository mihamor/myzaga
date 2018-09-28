let User = require("./models/user.js");
let { Track } = require("./models/tracks.js");
let { ServerApp } = require('webprogbase-console-view');
let { ConsoleBrowser } = require('webprogbase-console-view');
let { InputForm } = require('webprogbase-console-view');


let app = new ServerApp();
let browser = new ConsoleBrowser();
let path = './data/users.json'
Track.setStoragePath("./data/tracks.json");

app.use("/", function (req, res) {
  let links = {
    "users": "Show user interaction menu",
    "tracks": "Show track interaction menu"
  };
  res.send("You are in main menu", links);
});


app.use("tracks", function (req, res) {
  let links = {
    "allTracks": "Show all tracks",
    "getTrack": "Get track by id",
    "insert": "Insert new track to storage",
    "update": "Update track in storage",
    "delete": "Delete track by id"

  };
  res.send("Track interaction menu", links);
})

app.use("users", function (req, res) {
  let links = {
    "allUsers": "Show all users",
    "getUser": "Get user by id"
  };
  res.send("User interaction menu", links);
})

app.use("allUsers", function (req, res) {
  let users = User.getAll(path);
  let respStr = '';
  for (let user of users) {
    respStr += 'id: ' + user.id + ' | fullname: ' + user.fullname + '\n'
  }
  res.send(respStr);
})
app.use("allTracks", function (req, res) {
  let tracks = Track.getAll();
  let respStr = '';
  for (let track of tracks) {
    respStr += 'id: ' + track.id
      + ' | name: ' + track.name
      + ' | author: ' + track.author
      + ' | album: ' + track.album
      + ' | year: ' + track.year + '\n';
  }
  res.send(respStr);
})



app.use("getUser", function (req, res) {
  let nextState = "showUser";
  let fields = {
    "id": "Enter user id:"
  };
  let form = new InputForm(nextState, fields);
  res.send("Get user by id", form);
})

app.use("getTrack", function (req, res) {
  let nextState = "showTrack";
  let fields = {
    "id": "Enter track id:"
  };
  let form = new InputForm(nextState, fields);
  res.send("Get track by id", form);
})


app.use("showUser", function (req, res) {
  let user = User.getById(Number(req.data.id), path);
  if (!user) {
    res.redirect("getUser");
    return;
  }
  let respStr = 'id: ' + user.id + ' | fullname: ' + user.fullname + '\n';
  res.send(respStr);
})


app.use("showTrack", function (req, res) {
  let track = Track.getById(Number(req.data.id));
  if (!track) {
    res.redirect("getTrack");
    return;
  }
  let respStr = 'id: ' + track.id
    + ' | name: ' + track.name
    + ' | author: ' + track.author
    + ' | album: ' + track.album
    + ' | year: ' + track.year + '\n';
  res.send(respStr);
})


app.use("insert", function (req, res) {
  let nextState = "proccesInsert";
  let fields = {
    "author": "Enter track author:",
    "name": "Enter track name:",
    "album": "Enter track album:",
    "location": "Enter track location:",
    "length": "Enter track length:",
    "year": "Enter track year",
  };
  let form = new InputForm(nextState, fields);
  res.send("Insert track", form);
})

app.use("update", function (req, res) {
  let nextState = "proccesUpdate";
  let fields = {
    "id": "Enter track id:",
    "author": "Enter track author:",
    "name": "Enter track name:",
    "album": "Enter track album:",
    "location": "Enter track location:",
    "length": "Enter track length:",
    "year": "Enter track year",
  };
  let form = new InputForm(nextState, fields);
  res.send("Update track", form);
})

app.use("delete", function (req, res) {
  let nextState = "proccesDelete";
  let fields = {
    "id": "Enter track id:"
  };
  let form = new InputForm(nextState, fields);
  res.send("Delete track", form);
})
app.use("proccesInsert", function (req, res) {
  
  try {
    let track = new Track(0, req.data.author,req.data.name,
                           req.data.album, req.data.location,
                           Number(req.data.length), Number(req.data.year) );
    Track.insert(track);
  } catch(err){
    res.redirect("insert");
    return;
  }
  res.redirect("tracks");
})
app.use("proccesUpdate", function (req, res) {
  
  try {
    let track = new Track(Number(req.data.id), req.data.author,req.data.name,
                           req.data.album, req.data.location,
                           Number(req.data.length), Number(req.data.year) );
    Track.update(track);
  } catch(err){
    res.redirect("update");
    return;
  }
  res.redirect("tracks");
})

app.use("proccesDelete", function (req, res) {
  
  try {
    let del_id = Number(req.data.id);
    if(isNaN(del_id)) throw new Error();
    Track.delete(del_id);
  } catch(err){
    res.redirect("delete");
    return;
  }
  res.redirect("tracks");
})

app.listen(3000);
browser.open(3000);