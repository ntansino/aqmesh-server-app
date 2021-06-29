// Enable express and express-handlebars in project
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 1337;
const PATH = require("path");

// Configure template engine and template file (main.hbs)
app.engine("hbs", exphbs({
  defaultLayout: "main",
  extname: ".hbs"
}));

// Set template engine
app.set("view engine", "hbs");

// Give node access to everything in assets directory
app.use(express.static(PATH.join(__dirname, "/assets")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route rendering
app.get("/", function(req, res) {
  res.render("home", { title: "Home Page - AQMesh API" });
});

/*
app.get('/index', function (req, res) {
    res.redirect('/');
});
*/

app.post("/test", function(req, res) {

  //var accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  console.log(licenseKey);

  if(licenseKey != "\0") {
    res.render("test", { title: "Test Page - AQMesh API" });
    console.log("Redirected to /test");
  }
  else {
    res.render("404", { title: "INCORRECT INFO" });
    console.log("INCORRECT INFO");
  }
});

app.get("/*", function(req, res) {
  res.render("404");
});

// Listen on designated port number
app.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT + "\n\n" + "Press Ctrl+C to quit..")
});
