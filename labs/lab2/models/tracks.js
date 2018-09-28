const fs = require('fs');



let storage_path = '.';
class Track {


  constructor(id, author, name, album, location, length, year, addedAt = new Date().toISOString()) {
    this.id = id; // number
    this.author = author; //string
    this.album = album; //string
    this.name = name; // string
    this.location = location;  // string
    this.length = length; //number
    this.year = year; //number
    this.addedAt = addedAt; //date

    if (!check_params(this)) throw new Error("Invalid arguments");
  }

  // static functions to access storage
  static getById(id) {
    let tracks = Track.getAll();
    return search_for_id(id, tracks);
  }

  static update(x){
    if (!check_params(x)) throw new Error("Invalid argument");
    let data = getData();
    let tracks = data.items;

    let old_track = search_for_id(x.id, tracks);
    if(!old_track) 
      throw new Error("Track is not exist. Try insert() instead");
    assign_object_value(x, old_track);
    save_to_storage(data);
  }

  static insert(x){
    if ( !check_params(x)) throw new Error("Invalid argument");
    let data = getData();
    let tracks = data.items;
    let newId = data.nextId;
    data.nextId++;
    x.id = newId;
    data.items.push(x);
    save_to_storage(data);
    return newId;
  }

  // returns an array of all users in storage
  static getAll() {
    let data = getData();
    return data.items;
  }
  static setStoragePath(filename){
    if(typeof filename === 'string' 
    && fs.existsSync(filename))
      storage_path = filename;
    else throw new Error("Invalid storage path");
  }

  static delete(id){
    if(typeof id != 'number') 
      throw new Error("Invalid argument");
    let data = getData();
    let tracks = data.items;
    let result = remove_element(id, tracks);
    save_to_storage(data);
    return result;
  }

};

function save_to_storage(content){
  let content_json = JSON.stringify(content, null, 4);
  fs.writeFileSync(storage_path, content_json);
}

function check_params(track) {
  if (typeof track.id === 'number'
    && !isNaN(track.id)
    && typeof track.author === 'string'
    && typeof track.name === 'string'
    && typeof track.location === 'string'
    && typeof track.length === 'number'
    && !isNaN(track.length)
    && typeof track.year === 'number'
    && !isNaN(track.year)
    && typeof track.addedAt === 'string'
    && typeof track.album === 'string'
  ) return true;

  return false;
}

function getData(){
  if(!fs.existsSync(storage_path)) 
    throw new Error("invalid storage path");
  let rawData = fs.readFileSync(storage_path);
  let data = JSON.parse(rawData);
  return data;
}

function remove_element(id, tracks){
  let index = 0;
  for(let track of tracks){ 
    if(track.id === id){
      tracks.splice(index, 1);
      return true;
    }
    index++;
  }
  return false;
}

function search_for_id(id, tracks){
  for(let track of tracks){ 
    if(track.id === id) return track;
  }
}
function assign_object_value(from, to){
  for(let key in from){
    to[key] = from[key];
  }
}

module.exports = { Track };


