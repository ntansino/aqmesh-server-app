// Enable NodeJS packages in project
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mysql = require("my-sql");
const flash = require("connect-flash");
const helmet = require("helmet");
const passport = require("passport");
const Strategy = require("passport-http-bearer").Strategy;
const PATH = require("path");

// JSON object parsing
const jsonParser = bodyParser.json();

// Create Express instance
const app = express();

// Create secure app session
app.use(helmet());

app.use(session({
  name: 'test-session1101',
  secret: ['2yhDwesBV$WE5esa', '56y3bREFQetwyregtqwett$@WT'],
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 2 * 60 * 60 * 1000 // 2-hour session times
  }
}))

// Create MySQL Connection Pool
const connection_pool = mysql.createPool({
  host: "192.185.2.183",
  database: "ntansino_aqmesh_test",
  user: "ntansino_test1",
  password: "AQMeshData",
  port: "3306"
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
  res.render("test");
});

app.get("/register", function(req,res) {

  // Acquire values from HTML form input
  const sessionID = req.session.id;
  const companyName = req.body.companyName;
  const accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  if (companyName == null) {
    res.render("register");
  }

  else {

    console.log("BEGINNING QUERY\n");
    console.log("--------------------------------------------\n");

    var customerData = "INSERT INTO customerData (sessionID, companyName, username, password) VALUES (";
    customerData += "'" + sessionID + "',";      // sessionID
    customerData += "'" + companyName + "',";    // Company Name
    customerData += "'" + accountID + "',";      // Username
    customerData += "'" + licenseKey + "');";    // Password

    connection_pool.query(customerData, function (err, result) {
      if (err) {
        throw err;
        res.redirect(404, { title: "INCORRECT INFO" });
      }

    res.render("register");

    });

    console.log("--------------------------------------------\n");
  }

});

app.get('/index', function (req, res) {
  res.redirect('/');
});

app.get('/home', function (req, res) {

  // Acquire values from HTML form input
  const sessionID = req.session.id;
  const accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  if (accountID == null) {
    res.render("test", { title: "NO DATA ENTERED" });
  }

  else {
    console.log("BEGINNING QUERY\n");
    console.log("--------------------------------------------\n");

    var customerData = "SELECT * FROM customerData WHERE sessionID='" + sessionID + "'";

    connection_pool.query(customerData, function (err, result) {
      if (err) {
        throw err;
        res.redirect(404, { title: "INCORRECT INFO" });
      }

      res.render("test", { title: "STORED IN DB" });

    });

    console.log("--------------------------------------------\n");
  }
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
