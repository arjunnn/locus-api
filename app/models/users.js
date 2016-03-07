var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookmark = new Schema({
  place_name: {
    type: String
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

var userSchema = new Schema({
    // name: String,
    user_id: String,
    bookmarks: [bookmark]
})
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
