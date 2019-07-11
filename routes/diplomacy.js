const express = require('express')
const fs = require("fs")
const multer = require("multer")
const map = require("../diplomacy/map.json")

router = express.Router()
var diplomacy_mapname = "map_6-26.2.jpg"

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

router.get('/admin', function (req, res) {
  res.render('diplomacy_admin',{logged_in: req.session.logged_in, user:req.session.user})
})
router.get('/', function (req, res) {
  console.log(req.session)
  res.render('diplomacy',{map_name: diplomacy_mapname,logged_in: req.session.logged_in, user:req.session.user})
})

module.exports = router