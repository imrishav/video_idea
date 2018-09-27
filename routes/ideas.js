const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

require("../models/Ideas");
const Idea = mongoose.model("ideas");

//Add Idea form

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//Edit Form
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "not Authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

//Idea Index Page

router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ req: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

//Process Form
router.post("/", (req, res) => {
  let error = [];

  if (!req.body.title) {
    error.push({ text: "Add a title Please" });
  }
  if (!req.body.details) {
    error.push({ text: "Add Some Details" });
  }

  if (error.length > 0) {
    res.render("/add", {
      error: error,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "Idea Added Succesfully");
      res.redirect("/ideas");
    });
  }
});

//Edit Form process

router.put("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      res.redirect("/ideas");
    });
  });
});

//Delete Form Process

router.delete("/:id", (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Idea Deleted Succesfully");
    res.redirect("/ideas");
  });
});

module.exports = router;
