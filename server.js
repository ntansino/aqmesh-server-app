// Enable NodeJS packages in project
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const PATH = require("path");

// JSON object parsing
const jsonParser = bodyParser.json();

// Create Express instance
const app = express();

// Create app session
app.use(cookieSession({
  name: 'test-session1101',
  keys: ['2yhDwesBV$WE5esa', '56y3bREFQetwyregtqwett$@WT'],
  maxAge: 2 * 60 * 60 * 1000 // 2-hour session times
}))

// Use Flash package for input management (error control)
app.use(flash());
app.use(function (req, res, next) {
  res.locals.errors = req.flash("error");
  next();
});

// Acquire custom localhost port number
const PORT = process.env.PORT || 1337;

// Configure template engine and template file (main.hbs)
app.engine("hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs"
}));

// Set template engine
app.set("view engine", "hbs");

// Shorten paths for all project subdirectories
app.use(express.static(PATH.join(__dirname, "/assets")));
app.use(express.static(PATH.join(__dirname, "/assets/css")));
app.use(express.static(PATH.join(__dirname, "/assets/img")));
app.use(express.static(PATH.join(__dirname, "/assets/js")));
app.use(express.static(PATH.join(__dirname, "/views")));
app.use(express.static(PATH.join(__dirname, "/views/layouts")));

// Give access to necessary middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------ ROUTES ------------------------
app.get("/", function(req, res) {
  res.render("home", { title: "Home Page - AQMesh API" });
});

app.post("/test", function(req, res) {

  // Acquire values from HTML form input
  const accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  console.log("NEW ROUTE REACHED\n");
  console.log("--------------------------------------------\n");

  // Verify the validity of accountID and licenseKey
  if(licenseKey.length < 2) {
    req.flash("error", "User does not exist.");
    res.render("404", { title: "INCORRECT INFO" });
    console.log("INCORRECT INFO");
  }

  // Render failure page upon receiving incorrect data
  else {
    res.render("test", { title: "Test Page - AQMesh API" });
    console.log("Redirected to /test");
    console.log("The licenseKey is " + licenseKey + "..\n\n");
  }

  console.log("--------------------------------------------\n");
});

app.get('/index', function (req, res) {
  res.redirect('/');
});

app.get('/home', function (req, res) {
  res.redirect('/');
});

app.get("/*", function(req, res) {
  res.render("404");
});

// ------------------------ END OF ROUTES ------------------------


// Listen on designated port number
app.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT + "\n\n" + "Press Ctrl+C to quit..\n\n")
});
