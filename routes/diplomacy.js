const express = require('express')
const fs = require("fs")
const multer = require("multer")
const map = require("../diplomacy/map.json")

router = express.Router()
var diplomacy_mapname = JSON.parse(fs.readFileSync("./config.json")).diplomacy_mapname

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './res/maps');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('map_upload');


router.post('/admin', function (req, res) {
  if(req.session.user == "Colin" || req.session.user == "Michael")
  {
  upload(req,res,function(err) {
        if(err) {
        	throw(err)
            res.end("Error uploading file.");
        }
        console.log(req.file.originalname)
        diplomacy_mapname = req.file.originalname
        let config = JSON.stringify({"diplomacy_mapname": diplomacy_mapname})
        console.log(config)
        fs.writeFileSync("./config.json",config)
        res.end("File is uploaded");
    });
}
else
{
  res.end("Not Authorized for this")
}
});

router.get('/admin', function (req, res) {
  res.render('diplomacy_admin',{logged_in: req.session.logged_in, user:req.session.user})
})
router.get('/', function (req, res) {
  res.render('diplomacy',{map_name: diplomacy_mapname,logged_in: req.session.logged_in, user:req.session.user})
})

module.exports = router