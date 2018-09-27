const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();

const passport = require("passport");

//Load User Model

require("../models/Users");
const User = mongoose.model("users");

//User Login Route

router.get("/login", (req, res) => {
  res.render("users/login");
});

//User Regiser Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Login ROute

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//Post Register Route

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Password Not Matching Bro..." });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be more than 4 chars..." });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "User Already Registered");
        res.redirect("/users/login");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          password2: req.body.password2
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "Registerd");
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Logut

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "logged out");
  res.redirect("/users/login");
});

module.exports = router;