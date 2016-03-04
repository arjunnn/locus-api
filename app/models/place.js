
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlaceSchema = new Schema({
    name: String,
    id: String,
    minPrice: {type: Number, min: 0},
    maxPrice: {type: Number, min: 100},
    dateCreated: {type: Date, default: Date.now},
    likes: {type: Number, default: 0 },
    dislikes: {type: Number, default: 0 }
});

module.exports = mongoose.model('Place', PlaceSchema);