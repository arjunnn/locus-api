var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;

exports.connect = function() {
  if (mongo.DB) {
    return mongo.DB
   }
  mongoClient.connect('mongodb://localhost:27017/locus', function(err, db) {
    if (err) {
      console.log("problem with mongo");
      process.exit(1);
    }
    else {
      console.log("yay, mongo");
      mongo.DB = db
    }
  });
}
