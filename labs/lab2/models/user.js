const fs = require('fs');

module.exports.Storage = function Storage(filename = "user.json"){

  this.filename = filename;
  this.getAll = getAll;
  this.getById = getById;
}



function getAll(){
  let rawData = fs.readFileSync(this.filename);
  let data = JSON.parse(rawData);
  //console.log(data);
  return data.items; 
}
function getById(id = 0){
  let rawData = fs.readFileSync(this.filename);
  let users = JSON.parse(rawData).items;
  let resUser;
   users.forEach(function(user) {
    if(user.id == id){
      resUser = user;
      return;
    }
  }, this);

  return resUser;
}
