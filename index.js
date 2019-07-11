const express = require('express')
const path = require("path")
const scheduler = require("node-schedule")
const fs = require("fs")
const multer = require("multer")

const app = express()

const port = 80
var num_primary = 0
var num_secondary = 0
var num_other = 0
var seltzer_flavors = 
[["lime","Lime"],
["lemon","Lemon"],
["mandarin","Mandarin"],
["cranberry-lime", "Cranberry Lime"],
["raspberry-lime","Raspberry Lime"],
["black-cherry","Black Cherry"],
["ruby-red-grapefruit", "Ruby Red Grapefruit"]
]
var primary_today = "undefined"
var secondary_today = "undefined"
var diplomacy_mapname = "map_6-26.2.jpg"
function seltzerDict(){
	return {flavor_primary:primary_today, flavor_secondary:secondary_today, num_primary: num_primary, num_secondary: num_secondary, num_other: num_other}
}


app.set('view engine', 'pug')
app.use("/res", express.static(path.join(__dirname, 'res')));
app.use(express.urlencoded())

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


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './res/maps');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('map_upload');


app.get('/', (req, res) => res.send('Welcome to the Sunrise Intern-net'))

var newDay = new scheduler.RecurrenceRule();
newDay.hour = 0
newDay.minute = 0
newDay.dayOfWeek = new scheduler.Range(2,6)
scheduler.scheduleJob(newDay,resetSeltzer)

app.post('/set_seltzer',function (req, res) {
  console.log(req.body)
  newSeltzer(req.body.primary,req.body.secondary)
  res.render('set_seltzer', {seltzer_flavors: seltzer_flavors})
})
app.post('/seltzer',function (req, res) {
  console.log(req.body)
  if(req.body.primary != undefined)	num_primary +=1
  if (req.body.secondary != undefined) num_secondary += 1
  if (req.body.other != undefined) num_other +=1
  res.render('seltzer', seltzerDict())
})


app.get('/set_seltzer', function (req, res) {
  res.render('set_seltzer', {seltzer_flavors: seltzer_flavors})
})

app.post('/diplomacy_admin', function (req, res) {
  upload(req,res,function(err) {
        if(err) {
        	throw(err)
            res.end("Error uploading file.");
        }
        console.log(req.file.originalname)
        diplomacy_mapname = req.file.originalname
        res.end("File is uploaded");
    });
});

app.get('/diplomacy_admin', function (req, res) {
  res.render('diplomacy_admin')
})
app.get('/diplomacy', function (req, res) {
  res.render('diplomacy',{map_name: diplomacy_mapname})
})
app.post('/seltzer/primary', function (req, res) {
  num_primary += 1;
  res.render('seltzer', seltzerDict())
})
app.post('/seltzer/secondary', function (req, res) {
  num_secondary += 1;
  res.render('seltzer', seltzerDict())
})
app.post('/seltzer/other', function (req, res) {
  num_other += 1;
  res.render('seltzer', seltzerDict())
})
app.get('/seltzer', function (req, res) {
  res.render('seltzer', seltzerDict())
})
app.get('/seltzer_clean', function (req, res) {
  res.render('seltzer_clean', seltzerDict())
})

app.listen(port, () => console.log(`Sunrise Intern-net on ${port}!`))