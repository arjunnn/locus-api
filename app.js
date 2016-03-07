// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var request    = require('request');
var path       = require('path');
var mongoose   = require('mongoose');
// var dbConnection = require(path.join(__dirname, '.', 'dbConnection'));
//
// dbConnection.connect();
// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

mongoose.connect('mongodb://MongoLabLocus:6Dqdq3J4a7dbFw6vk0f8EEuIluv7LBmzJLR7S2KrYjo-@ds064188.mlab.com:64188/MongoLabLocus');

var Place     = require('./app/models/place');
var User      = require('./app/models/users');
var latitude;
var longitude;
var url;
// var user_key = 'e1fd503923ef41dd65f0772663565809';
var user_key = 'd16619ef54ceb62c8fed56f6e48fa02a';
var key = 'AIzaSyA9GJ-PPKyBHaheaNVOPqoim2afC3DcC5M'; //google places api server key
var info;
var radius;
// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
		// res.sendFile(readme.md);
		res.sendFile(path.join(__dirname, '.', 'api.html'));
    // res.json({message: "Hooray! welcome to Locus API"})
});

// on routes that end in geocode
//--------------------------------

router.route('/geocode')

.get(function(req, res) {
    // latitude = req.headers.lat;
    // longitude = req.headers.lng;
    // url = 'https://developers.zomato.com/api/v2.1/geocode?lat='+latitude+'&lon='+longitude;
		latitude = req.headers.lat;
		longitude = req.headers.lng;
		radius = req.headers.radius;
		url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latitude+','+longitude+'&radius='+radius+'&types=park|amusement_park|art_gallery|bowling_alley|cafe|zoo|restaurant|night_club|museum&key='+key;
    var options = {
        url: url,
        // headers: {
        //     'user_key': user_key
        // }
    };
		function callback(error, response, body) {
  		if (!error && response.statusCode == 200) {
				info = JSON.parse(body);
				var placeCodes = [];
				var placeLat = [];
				var placeLng = [];
				var ratings = [];
				var placeNames = [];
				// for (var place in info.nearby_places) {
				// 	if (info.nearby_places.hasOwnProperty(place)) {
				// 	}
				// }
				for (var i = 0; i < info.results.length ; i ++) {
					placeCodes[i] = info.results[i].place_id;
					placeLat[i] = info.results[i].geometry.location.lat;
					placeLng[i] = info.results[i].geometry.location.lng;
					ratings[i] = info.results[i].rating;
					placeNames[i] = info.results[i].name;
				}
				var responseJSON = JSON.stringify({names: placeNames, codes: placeCodes, lats: placeLat, lngs: placeLng, ratings: ratings});
				res.setHeader('Content-Type', 'application/json');
				console.log(info.results.length);
				res.send(responseJSON);
			}
		  else {
	      res.json(error);
			}
		}

	request(options, callback);
})


router.route('/park')
.get(function(req, res) {
	latitude = req.headers.lat;
	longitude = req.headers.lng;
	radius = req.headers.radius;
	url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latitude+','+longitude+'&radius='+radius+'&types=park|amusement_park|art_gallery|bowling_alley|cafe|zoo|restaurant|night_club|museum&key='+key;

	var options = {
			url: url,
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			info = JSON.parse(body);
			if (info.status == "OK") {
				res.send(info);
			}
			else {
				res.json({status: "error"})
			}
		}
		else {
			res.send(error);
		}
	}
	request(options, callback);
	// res.send("Hi there. Your connection is 100% OK");
})


router.route('/place')
.get(function(req, res) {
	var place_id = req.headers.place_id;
	// url = "https://developers.zomato.com/api/v2.1/restaurant?res_id="+res_id;
	url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+place_id+'&key='+key;
	var options = {
			url: url,
			// headers: {
			// 		'user_key': user_key
			// }
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			info = JSON.parse(body);
			res.setHeader('Content-Type', 'application/json');
			// var imageURL = info.featured_image;
			// var avgCostForTwo = info.average_cost_for_two;
			if (info.result.hasOwnProperty('formatted_address')) {
				var address = info.result.formatted_address;
			}
			else {
				var address = "null"
			}
			if (info.result.hasOwnProperty('phoneNumber')) {
				var phoneNumber = info.result.international_phone_number;
			}
			else {
				var phoneNumber = "null"
			}
			if (info.result.hasOwnProperty('opening_hours')) {
				var openNow = info.result.opening_hours.open_now;
			}
			else {
				var openNow = "null";
			}
			if (info.result.hasOwnProperty('website')) {
				var website = info.result.website;
			}
			else {
				var website = "null"
			}
			var responseJSON = JSON.stringify({address: address, phone_number: phoneNumber, open_now: openNow, website: website});
			res.send(responseJSON);
		}
		else {
			res.json(error);
		}
	}
request(options, callback);
})


router.route('/test')
.get(function(req, res) {
	var options = {
			url: url,
			headers: {

			}
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			info = JSON.parse(body);
		}
		else {
			res.send(error);
		}
	}
	request(options, callback);
	res.send("Hi there. Your connection is 100% OK");
})


router.route('/bookmarks')
.post(function(req, res) {
	var user_id = req.body.user_id;
	// var user = User.find({
	// 	'user_id': user_id
	// });
	User.findOne({ 'user_id': user_id }, 'user_id', function (err, user) {
  if (err) return handleError(err);
  res.send(user); // Space Ghost is a talk show host.
})
	var place_name = req.body.place_name;
	var latitudes = req.body.lat;
	var latitudes = req.body.lng;
	// var user = User.find();
	// User.find({
  //   'user_id': user_id
  // }, function(err, teams) {
  //   if (err) {
  //     onErr(err, callback);
  //   } else {
  //     callback("", teams);
  //   }
  // });


	res.send(user);

})

.get(function(req, res) {
	res.send("Hi there. Your connection is 100% OK");

})


// // on routes that end in /places
// // ----------------------------------------------------
router.route('/users')

	.post(function(req, res) {
		var user = new User();		// create a new instance of the user model
		user.user_id = req.body.user_id;  // set the user name (comes from the request)
        // console.log('new user name added '+ user.user_id);
        // res.json({ message:"added"+user.name});

		user.save(function(err) {
			if (err){
				res.send({message: err});
			}
			res.send({ message: 'user created! '+ user.user_id });
		});


	})

	.get(function(req, res) {
			var users = User.find(function(err, userslist) {
				if (err)
					res.send(err);

				res.setHeader('Content-Type', 'application/json');
				res.send(userslist);
			});
		});

// 	// get all the places (accessed at GET http://localhost:8080/api/places)
// 	.get(function(req, res) {
// 		Place.find(function(err, places) {
// 			if (err)
// 				res.send(err);

// 			res.json(places);
// 		});
// 	});

// // on routes that end in /places/:place_id
// // ----------------------------------------------------
// router.route('/places/:place_id')

// 	// get the place with that id
// 	.get(function(req, res) {
// 		Place.findById(req.params.place_id, function(err, place) {
// 			if (err)
// 				res.send(err);
// 			res.json(place);
// 		});
// 	})

// 	// update the place with this id
// 	.put(function(req, res) {
// 		Place.findById(req.params.place_id, function(err, place) {

// 			if (err)
// 				res.send(err);

// 			place.name = req.body.name;
// 			place.save(function(err) {
// 				if (err)
// 					res.send(err);

// 				res.json({ message: 'Place updated!' });
// 			});

// 		});
// 	})

// 	// delete the place with this id
	// .delete(function(req, res) {
	// 	Place.remove({
	// 		_id: req.params.place_id
	// 	}, function(err, place) {
	// 		if (err)
	// 			res.send(err);

	// 		res.json({ message: 'Successfully deleted' });
	// 	});
	// });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
