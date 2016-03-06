// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var request    = require('request');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
var Place     = require('./app/models/place');

var latitude;
var longitude;
var url;
var user_key = 'e1fd503923ef41dd65f0772663565809';
var info;

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
    res.json({message: "Hooray! welcome to Locus API"})
});

// on routes that end in geocode
//--------------------------------

router.route('/geocode')

.get(function(req, res) {
    latitude = req.headers.lat;
    longitude = req.headers.lng;
    url = 'https://developers.zomato.com/api/v2.1/geocode?lat='+latitude+'&lon='+longitude;
    var options = {
        url: url,
        headers: {
            'user_key': user_key
        }
    };
		function callback(error, response, body) {
  		if (!error && response.statusCode == 200) {
				info = JSON.parse(body);
				var restaurantCodes = [];
				var restaurantLat = [];
				var restaurantLng = [];
				var userRatingVotes = [];
				var restaurantNames = [];
				for (var restaurant in info.nearby_restaurants) {
					if (info.nearby_restaurants.hasOwnProperty(restaurant)) {
					}
				}
				for (var i = 0; i < restaurant; i ++) {
					restaurantCodes[i] = info.nearby_restaurants[i+1].restaurant.R.res_id;
					restaurantLat[i] = info.nearby_restaurants[i+1].restaurant.location.latitude;
					restaurantLng[i] = info.nearby_restaurants[i+1].restaurant.location.longitude;
					aggregateRatings[i] = info.nearby_restaurants[i+1].restaurant.user_rating.aggregate_rating;
					restaurantNames[i] = info.nearby_restaurants[i+1].restaurant.name;
				}
				var responseJSON = JSON.stringify({names: restaurantNames, codes: restaurantCodes, lats: restaurantLat, lngs: restaurantLng, ratings: aggregateRatings});
				res.setHeader('Content-Type', 'application/json');
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
	res.send("Hi there. Your connection is 100% OK");
})


router.route('/restaurant/:res_id')
.get(function(req, res) {
	var res_id = req.params.res_id;
	url = "https://developers.zomato.com/api/v2.1/restaurant?res_id="+res_id;
	var options = {
			url: url,
			headers: {
					'user_key': user_key
			}
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			info = JSON.parse(body);
			res.setHeader('Content-Type', 'application/json');
			var imageURL = info.featured_image;
			var avgCostForTwo = info.average_cost_for_two;
			var address = info.location.address;
			var responseJSON = JSON.stringify({address: address, image_url: imageURL, cost_for_two: avgCostForTwo});
			res.send(responseJSON);
		}
		else {
			res.json(error);
		}
	}
request(options, callback);
})
	// get all the places (accessed at GET http://localhost:8080/api/places)


// // on routes that end in /places
// // ----------------------------------------------------
// router.route('/places')

// 	// create a place (accessed at POST http://localhost:8080/places)
// 	.post(function(req, res) {

// 		var place = new Place();		// create a new instance of the Place model
// 		place.name = req.body.name;  // set the places name (comes from the request)
//         console.log('new place name added'+ place.name);
//         res.json({ message:place.name});

// 		place.save(function(err) {
// 			if (err)
// 				res.send(err);

// 			res.json({ message: 'Place created!' });
// 		});


// 	})

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
