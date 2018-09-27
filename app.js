const express = require("express");
const path = require("path");
const methodOveride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

//Load Routes

const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport Config

require("./config/passport")(passport);

//Db COnfig

const db = require("./config/database");
//Connect to DB

mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("mongo connected"))
  .catch(err => console.log(err));

//Load Models

//Middle-ware

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//For Body-parser
//Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Static Folder

app.use(express.static(path.join(__dirname, "public")));

//Method_override
app.use(methodOveride("_method"));

//Session -Express middleware..
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  })
);

//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//GEt -Request
app.get("/", function(request, response) {
  const title = "Welcome1";
  response.render("index", {
    title: title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

//Use Routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started`));
