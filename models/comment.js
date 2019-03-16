const {Storage}  = require('./storage.js');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  content: {type: String, required: true},
  addedAt: {type: Date, default: Date.now }
});

const CommentModel = mongoose.model('Comment', CommentSchema);


class Comment extends Storage{
  
  static check_params(x) {
    return valid_string(x.content)
       // && valid_string(x.playlistRef)
  }

  static this_model() {
    return CommentModel;
  }

  constructor(content, user, addedAt = new Date().toISOString()) {
    super();
    this.user = user;
    this.content = content;
    this.addedAt = addedAt; //date
  }
};

function valid_number(num) {
  return typeof num === 'number'
      && !isNaN(num);
}
function valid_string(str){
  return typeof str === 'string'
  && str.length != 0;
}
module.exports = { Comment };


