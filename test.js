const {Track} = require('./models/track.js');
Track.setStoragePath("./data/tracks.json");


let track = new Track (14, "Metallica", "Enter Sandman", "1", ".", 1, 1, '../images/tracks/drenaj.jpeg');
/*Track.delete(14, (error) =>{
    if(error) console.log(error.toString());
    else console.log("deleted");
});*/

//Track.getAll()
//    .then(x => console.log(x));

//Track.getById("")
//    .then(x => console.log(x))
//    .catch(err => console.log(err.message));
/*Track.insert(track)
    .then(id => id)
    .catch(err => console.log(err.message))
    .then(x => {
        console.log("inserted at id: " + x);
        track.name = "Megadeth";
        return Track.update(track);
    })
    .then(() => console.log("updated"));*/
Track.delete(41)
    .then(() => console.log("deleted"))
    .catch(err => console.log(err.message));