const {Storage} = require('./storage.js');

class User extends Storage{
  
  static check_params(x) {
    return valid_number(x.id)
        && typeof x.login === 'string'
        && typeof x.fullname === 'string'
        && typeof x.avaUrl === 'string'
        && valid_number(x.role)
        && typeof x.registeredAt === 'string'
        && typeof x.isDisabled === 'boolean';
  }

  constructor(id, username, fullname, role, registeredAt, avaUrl, isDisabled=false) {
    super();
    this.id = id; // number
    this.login = login;  // string
    this.fullname = fullname;  // string
    this.role = role; // number
    this.registeredAt = registeredAt; // string
    this.avaUrl = avaUrl; // string
    this.isDisabled = isDisabled; // boolean
   }
};
module.exports = {User};
