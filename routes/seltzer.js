const express = require('express')
const scheduler = require("node-schedule")

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

var num_primary = 0
var num_secondary = 0
var num_other = 0

var primary_today = "undefined"
var secondary_today = "undefined"

function seltzerDict(req){
	return {flavor_primary:primary_today, flavor_secondary:secondary_today, num_primary: num_primary, num_secondary: num_secondary, num_other: num_other, logged_in : req.session.logged_in, user: req.session.user}
}

function resetSeltzer()
{
	yesterday = new Date()
	yesterday.setDate(yesterday.getDate() -1)

	fs.appendFile('seltzer.log',yesterday.toDateString() + "," + primary_today + "," + secondary_today + "," + num_primary + "," + num_secondary + "," + num_other + "\n",(err) => {
		  if (err) throw err;
		  console.log('Seltzer Reset, data logged.');
		})
	newSeltzer("undefined","undefined")
}

function newSeltzer(primary, secondary){
	primary_today = primary
	secondary_today = secondary
	//fs.appendFile("")
	num_primary = 0
    num_secondary = 0
    num_other = 0
}

var newDay = new scheduler.RecurrenceRule();
newDay.hour = 0
newDay.minute = 0
newDay.dayOfWeek = new scheduler.Range(2,6)
scheduler.scheduleJob(newDay,resetSeltzer)

router.post('/set',function (req, res) {
  console.log(req.body)
  newSeltzer(req.body.primary,req.body.secondary)
  res.render('set_seltzer', {seltzer_flavors: seltzer_flavors})
})
router.post('/',function (req, res) {
  console.log(req.body)
  if(req.body.primary != undefined)	num_primary +=1
  if (req.body.secondary != undefined) num_secondary += 1
  if (req.body.other != undefined) num_other +=1
  res.render('seltzer', seltzerDict(req))
})

router.get('/set', function (req, res) {
  res.render('set_seltzer', {seltzer_flavors: seltzer_flavors})
})

router.post('/primary', function (req, res) {
  num_primary += 1;
  res.render('seltzer', seltzerDict(req))
})
router.post('/secondary', function (req, res) {
  num_secondary += 1;
  res.render('seltzer', seltzerDict(req))
})
router.post('/other', function (req, res) {
  num_other += 1;
  res.render('seltzer', seltzerDict(req))
})
router.get('/', function (req, res) {
  res.render('seltzer', seltzerDict(req))
})
module.exports = router