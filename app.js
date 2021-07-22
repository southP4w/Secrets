// jshint esversion:8

require('dotenv').config();
const express = require("express"),
  app = express();
const bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  encrypt = require("mongoose-encryption"),
  ejs = require("ejs"),
  _ = require("lodash");

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema(s)/Object(s):
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"]
});
const User = new mongoose.model("User", userSchema);

app.route("/")
  .get((req, res) => {
    res.render("home"); // render home.ejs
  });

app.route("/login")
  .get((req, res) => {
    res.render("login"); // render login.ejs
  })
  .post((req, res) => {
    const username = req.body.username,
      password = req.body.password;
    User.findOne({
      email: username
    }, (err, foundUser) => {
      if (err)
        res.send(err);
      else if (foundUser)
        if (foundUser.password === password)
          res.render("secrets"); // render secrets.ejs
    });
  });

app.route("/register")
  .get((req, res) => {
    res.render("register"); // render register.ejs
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save((err) => {
      if (err)
        res.send(err);
      else
        res.render("secrets"); // render secrets.ejs
    });
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});