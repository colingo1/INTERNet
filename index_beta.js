const express = require('express')
const path = require("path")
const fs = require("fs")
const multer = require("multer")
const session = require("express-session")

const app = express()

const port = 8001


app.set('views', path.join(__dirname, 'views_beta'))
app.set('view engine', 'pug')
app.use("/res", express.static(path.join(__dirname, 'res')));
app.use(express.urlencoded())
app.use(session({ secret: 'very important secretive secret'}))


app.get('/', (req, res) => res.send('Welcome to the Sunrise Intern-net'))
app.use("/seltzer", require("./routes/seltzer"))
app.use("/diplomacy",require("./routes/diplomacy"))

app.get("/login",function (req, res) {
  res.render('login')
})
app.post("/login",function(req,res) {
  req.session.user = "Colin"
  req.session.logged_in = true
  res.render("login", {logged_in : req.session.logged_in, user: req.session.user})
})
app.get("/logout",function(req,res){
  req.session.logged_in = false
  res.render("login",{logged_in : req.session.logged_in, user: req.session.user})
})


app.listen(port, () => console.log(`Sunrise Intern-net on ${port}!`))