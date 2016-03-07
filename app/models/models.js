var mongoose = require('mongoose');
var Schema = require('schema');

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
var UserSchema = new Schema({
    // name: String,
    id: String,
    bookmarks: [bookmark]
})

var User = mongoose.model('User', UserSchema);
