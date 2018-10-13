const {Track} = require('./models/track.js');
Track.setStoragePath("./data/tracks.json");


let track = new Track (14, "Metallica", "Enter Sandman", "1", ".", 1, 1, '../images/tracks/drenaj.jpeg');
Track.delete(14, (error) =>{
    if(error) console.log(error.toString());
    else console.log("deleted");
});
