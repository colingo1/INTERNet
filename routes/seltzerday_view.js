const express = require('express')
const scheduler = require("node-schedule")
const fs = require("fs")
const router = express.Router()
var seltzer_flavors = 
[["lime","Lime"],
["lemon","Lemon"],
["mandarin","Mandarin"],
["cranberry-lime", "Cranberry Lime"],
["raspberry-lime","Raspberry Lime"],
["black-cherry","Black Cherry"],
["ruby-red-grapefruit", "Ruby Red Grapefruit"]
]

var num_by_flavor = {
	"lemon":7,
	"lime":6,
	"cranberry-lime":8,
	"raspberry-lime":7,
	"black-cherry":6,
	"ruby-red-grapefruit":4,
	"mandarin":8
}

var num_by_user = {
	"Alex" :9,
	"Leif": 9,
	"Colin": 7,
	"Jenna": 6,
	"Peter":5,
	"Eric": 5,
	"Michael" : 4,
	"Jonathan": 1
}

function seltzerDict(req){
	var user_tuples = Object.keys(num_by_user).map(function(key) {
  		return [key, num_by_user[key]];
	});

	user_tuples.sort(function(first, second) {
  		return second[1] - first[1];
	});
	return {logged_in : req.session.logged_in, user: req.session.user, user_seltzers: user_tuples, my_seltzers: num_by_user[req.session.user], flavors: num_by_flavor}
}

router.get('/', function (req, res) {
  res.render('seltzer_day_view',seltzerDict(req))
})



module.exports = router