let { User } = require("./models/user.js");
let { Track } = require("./models/track.js");
let { ServerApp, ConsoleBrowser, InputForm } = require('webprogbase-console-view');

let app = new ServerApp();
let browser = new ConsoleBrowser();
Track.setStoragePath("./data/tracks.json");
User.setStoragePath("./data/users.json");

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
  let users = User.getAll();
  let respStr = '';
  for (let user of users) {
    respStr += `id: ${user.id} | fullname: ${user.fullname}\n`;
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
  let invalidData = false;
  if(req.data.id.isEmpty()) invalidData = true; 

  let user = null;
  let currId = Number(req.data.id);
  if(!invalidData) {
    user = User.getById(currId);
    if(!user) invalidData = true;
  } 

  if (invalidData) {
    res.redirect("getUser");
    return;
  }


  let respStr = `id: ${user.id} | fullname: ${user.fullname}\n`;
  res.send(respStr);
})


app.use("showTrack", function (req, res) {

  let invalidData = false;
  if(req.data.id.isEmpty()) invalidData = true;

  let track = null;
  let currId = Number(req.data.id);
  if(!invalidData) {
    track = Track.getById(currId);
    if(!track) invalidData = true;
  }
  if (invalidData) {
    res.redirect("getTrack");
    return;
  }

  let links = {
    "updateTrack":{
      description: "Update current track",
      data : {
        trackId: currId,
      }
    },
    "deleteTrack":{
      description: "Delete current track",
      data : {
        trackId: currId,
      }
    }
  };

  let respStr =`
  | id: ${track.id} 
  | name: ${track.name} 
  | author: ${track.author} 
  | album: ${track.album} 
  | year: ${track.year}\n`;
  res.send(respStr, links);
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

app.use("updateTrack", function (req, res) {
  let nextState = "proccesUpdate";
  let trackId = Number(req.data.trackId);
  let track = Track.getById(trackId);
  let fields = {
    "id": {
      description: "Enter track id:",
      auto: trackId.toString()
    },
    "author": {
      description: "Enter track author:",
      default: track.author
    },
    "name":  {
      description: "Enter track name:",
      default: track.name
    },
    "album": {
      description: "Enter track album:",
      default: track.album
    },
    "location":  {
      description: "Enter track location:",
      default: track.location
    },
    "length":  {
      description: "Enter track length:",
      default: track.length.toString()
    },
    "year":  {
      description: "Enter track year:",
      default: track.year.toString()
    },
  };
  let form = new InputForm(nextState, fields);
  let respStr =`
  | id: ${track.id} 
  | name: ${track.name} 
  | author: ${track.author} 
  | album: ${track.album} 
  | year: ${track.year}
  | location: ${track.location}
  | length: ${track.length}
  Leave empty field, if you dont want to change current property.`;
  res.send(respStr, form);
})

app.use("deleteTrack", function (req, res) {
  Track.delete(Number(req.data.trackId));
  res.redirect("tracks");
})
app.use("proccesInsert", function (req, res) {
  let invalidData = false;
  try {
    let track = new Track(0, req.data.author,req.data.name,
                          req.data.album, req.data.location,
                          Number(req.data.length), Number(req.data.year) );
    Track.insert(track);
  } catch(err){invalidData= true;}

  if(invalidData){
    res.redirect("insert");
    return;
  }

  res.redirect("tracks");
});
app.use("proccesUpdate", function (req, res) {
  let invalidData = false;
  if(req.data.id.isEmpty()) invalidData = true;
  if (!invalidData) try {
    let track = new Track(Number(req.data.id), req.data.author,req.data.name,
                          req.data.album, req.data.location,
                          Number(req.data.length), Number(req.data.year) );
    Track.update(track);
  }catch(err){invalidData = true;}

  if(invalidData){
    res.redirect("updateTrack", {
      trackId : req.data.id
    });
    return;
  }
  res.redirect("tracks");
});
app.listen(3000);
browser.open(3000);

String.prototype.isEmpty = function(){
  return this.length === 0;
}