var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookmark = new Schema({
  placeName: {
    type: String
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
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
