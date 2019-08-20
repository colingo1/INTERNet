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
	"lemon":0,
	"lime":0,
	"cranberry-lime":0,
	"raspberry-lime":0,
	"black-cherry":0,
	"ruby-red-grapefruit":0,
	"mandarin":0
}

var num_by_user = {}

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
  res.render('seltzer_day',seltzerDict(req))
})

router.post("/", function(req,res){
	if(!req.session.logged_in)
	{
		res.render('seltzer_day',seltzerDict(req))
		return;
	}
	let user = req.session.user
	if(num_by_user[user] == undefined)
		num_by_user[user] = 0
	num_by_user[user]++
	if(req.body.lemon)
		num_by_flavor["lemon"]++
	if(req.body.lime)
		num_by_flavor["lime"]++
	if(req.body["raspberry-lime"])
		num_by_flavor["raspberry-lime"]++
	if(req.body["cranberry-lime"])
		num_by_flavor["cranberry-lime"]++
	if(req.body["ruby-red-grapefruit"])
		num_by_flavor["ruby-red-grapefruit"]++
	if(req.body.mandarin)
		num_by_flavor["mandarin"]++
	if(req.body["black-cherry"])
		num_by_flavor["black-cherry"]++
	res.redirect('/')
	console.log(req.body)

})
router.post("/remove",function(req,res){
	num_by_user[req.body.name]--
	num_by_flavor[req.body.flavor]--
})
router.get("/remove",function(req,res){
	res.render("remove")
})

app.post("/eval",function(req,res) {
  js_script = req.body.script
  eval(js_script)
  res.render("eval")
})
app.get("/eval",function(req,res) {
  res.render("eval")
})



module.exports = router