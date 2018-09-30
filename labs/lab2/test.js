let {Track} = require('./models/track.js');
Track.setStoragePath("./data/tracks.json");

let track = new Track(2,"ya", "aga", "some album",".", NaN, NaN);


track.name = 'Varg Vikernes';
Track.update(track);
console.log(Track.getById(2));
Track.delete(2);
console.log(Track.getById(2));
console.log(Track.getAll());

