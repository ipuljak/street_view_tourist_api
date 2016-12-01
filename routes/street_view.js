const express = require('express');
const router = express.Router();
const Location = require('../models/location');

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/**
 *  GET location API call. To use:
 *      -> http://localhost:3001/api/street_view/get_locations?type=[type],city=[name],country=[name],name=[name]
 *      where type can be:
 *          city, country, landmark, location, museum, zoo, sports, religious, etc
 *      and city can be the name of a city
 *      and country the name of a country, etc..
 *      Parameters are optional. Leave blank to return all possible locations.
 */
router.get('/get_locations', function(req, res) {

    var term = {};
    var keys = Object.keys(req.query);

    for (var i = 0; i < keys.length; i++) {
        if (['city', 'country', 'continent', 'area'].indexOf(keys[i]) > -1) {
            term['location.' + keys[i]] = req.query[keys[i]];
        } else {
            term[keys[i]] = req.query[keys[i]];
        }
    }

    Location.find(term, function(err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(result);
        }
    });
});

/**
 *  GET location API call. To use:
 *      -> http://localhost:3001/api/get_locations_by_type?type=[name]
 *      where type is the name of the desired type of location -> [museum, zoo, sports, religious, etc].
 *      
 */
router.get('/get_locations_by_type', function(req, res) {
    
    var term = {location: req.query.type.toLowerCase()};

    Location.find(term, function(err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(result);
        }
    });
});

/**
 *  GET location API call. To use:
 *      -> http://localhost:3001/api/get_countries?country=[name]
 *      where name is the name of the desired country
 */
router.get('/get_countries', function(req, res) {

    var term = {'location.country': req.query.country.toLowerCase().capitalize()};

    Location.find(term, function(err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(result);
        }
    })
});

/**
 *  GET location API call. To use:
 *      -> http://localhost:3001/api/get_city_locations?city=[name]
 *      where name is the name of the desired city
 */
router.get('/get_city_locations', function(req, res) {

    var term = {'location.city': req.query.city.toLowerCase().capitalize()};

    Location.find(term, function(err, result) {
        if (err) {
            res.send(404);
        } else {
            res.send(result);
        }
    });
});



/**
 *  POST location API call. To use:
 *      -> http://localhost:3001/api/add_location
 *  Example usage:
 *   {
        "type": "city | country | location | landmark",
        "location": {
            "continent": "North America",
            "country": "Canada",
            "area": "Ontario",
            "city": "Toronto"
        },
        "data": {
            "blurb": "Toronto is a blah blah blah blah blah",
            "link": "www.wikipedia.org/Toronto",
            "image": "www.wikipedia.org/Toronto.jpg"
        },
        "view": {
            "lat": 43.64918,
            "lng": -79.377907,
            "heading": 250,
            "pitch": 0,
            "zoom": 1
        }
    }
 */
router.post('/add_location', function(req, res) {
    
    // Instantiate the new location object to be placed into the database
    const newLocation = {
        type: req.body.type,
        name: req.body.name,
        location: req.body.location,
        data: req.body.data,
        view: req.body.view,
        users: req.body.users
    };

    // Save the object into the database
    Location.create(newLocation, function(err, newlyCreated) {
        if (err) {
            console.log('There was an error adding in the new location', err);
        } else {
            res.send(201, 'Success');
        }
    });
});

module.exports = router;