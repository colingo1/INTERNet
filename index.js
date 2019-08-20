const express = require('express')
const path = require("path")
const fs = require("fs")
const multer = require("multer")
const session = require("express-session")
const FileStore = require("session-file-store")(session)

const app = express()
const port = parseInt(process.argv[2])

function validateCredentials(req)
{
  users = JSON.parse(fs.readFileSync("./users.json"))
  correct_password = users[req.body.username]
  if(correct_password == req.body.password)
  {
    req.session.user = req.body.username
    req.session.logged_in = true
    return true
  }
  return false
}

//app.set('views', path.join(__dirname, 'views_beta'))
app.set('view engine', 'pug')
app.use("/res", express.static(path.join(__dirname, 'res')));
app.use(express.urlencoded())
app.use(session({
  store: new FileStore({}),
  secret: 'very important secretive secret'
}))


app.get('/', (req, res) => res.send('Welcome to the Sunrise Intern-net'))
app.use("/seltzer", require("./routes/seltzer"))
app.use("/diplomacy",require("./routes/diplomacy"))
app.use("/seltzerday",require("./routes/seltzerday_view"))

app.get("/change_password",function (req, res) {
  res.render('change_password',{logged_in : req.session.logged_in, user: req.session.user})
})

app.post("/change_password",function(req,res) {
  users = JSON.parse(fs.readFileSync("./users.json"))
  correct_password = users[req.session.user]
  old_password = req.body.old_password
  if(correct_password == old_password && req.session.logged_in)
  {
    users[req.session.user] = req.body.new_password
    console.log("changing password for " + req.session.user)
    users_string = JSON.stringify(users,null,2)
    fs.writeFileSync('./users.json',users_string)
  }
  res.render("change_password", {logged_in : req.session.logged_in, user: req.session.user})
})

app.get("/login",function (req, res) {
  res.render('login',{logged_in : req.session.logged_in, user: req.session.user})
})
app.post("/login",function(req,res) {
  res.render("login", {failed:!validateCredentials(req), logged_in : req.session.logged_in, user: req.session.user})
})
app.get("/logout",function(req,res){
  req.session.logged_in = false
  req.session.user = undefined
  res.render("login",{logged_in : req.session.logged_in, user: req.session.user})
})

app.post("/eval",function(req,res) {
  js_script = req.body.script
  eval(js_script)
  res.render("eval")
})
app.get("/eval",function(req,res) {
  res.render("eval")
})

app.listen(port, () => console.log(`Sunrise Intern-net on ${port}!`))