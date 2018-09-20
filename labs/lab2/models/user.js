const fs = require('fs');
class User {
  
  constructor(id, username, fullname, role, registeredAt, avaUrl, isDisabled=false) {
    this.id = id; // number
    this.login = login;  // string
    this.fullname = fullname;  // string
    this.role = role;
    this.registeredAt = registeredAt;
    this.avaUrl = avaUrl;
    this.isDisabled = isDisabled;
   }
  
  // static functions to access storage

  static getById(id, filename) {
    let rawData = fs.readFileSync(filename);
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
  
  // returns an array of all users in storage
  static getAll(filename){
    let rawData = fs.readFileSync(filename);
    let data = JSON.parse(rawData);
    return data.items; 
  }
};
module.exports = User;
