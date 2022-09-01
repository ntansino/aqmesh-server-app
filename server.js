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

// Launch session/cookies w/ set attributes (hash keys, session time, etc.)
app.use(session({
  name: 'test-session1101',
  secret: ['fakeKey123456', 'fakeKey123456'], //changed auth details since project end for security
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 2 * 60 * 60 * 1000 // 2-hour session times
  }
}))

// Create MySQL Connection Pool
const connection_pool = mysql.createPool({
  host: "1.1.1.1", //changed auth details since project end for security
  database: "aqmesh_test",
  user: "test1",
  password: "faskePassword12345", //changed auth details since project end for security
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

app.get("/register", function(req, res) {
  res.render("register", { title: "Register Now! - AQMesh API" });
});

app.post("/test", function(req, res) {
  res.render("test", { title: "Test Page - DEFAULT" });
});

app.post("/tryRegister", function(req,res) {
  // Acquire values from HTML form input
  const sessionID = req.session.id;
  const companyName = req.body.companyName;
  const accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  // companyName not entered by user
  if (companyName == null) {
    res.render("register", { title: "Error: Empty Input" });
  }

  // Successful User Registration Attempt
  else {

    console.log("BEGINNING QUERY\n");
    console.log("--------------------------------------------\n");

    // Build SQL Query with user information
    var customerData = "INSERT INTO customerData (sessionID, companyName, username, password) VALUES (";
    customerData += "'" + sessionID + "',";      // sessionID
    customerData += "'" + companyName + "',";    // Company Name
    customerData += "'" + accountID + "',";      // Username
    customerData += "'" + licenseKey + "');";    // Password

    // Send Query to MySQL (INSERT)
    connection_pool.query(customerData, function (err, result) {

      // Unsuccessful Data Entry --> Redirect to 404 Page
      if (err) {
        throw err;
        res.redirect(404, { title: "INCORRECT INFO" });
      }

      // Successul Data Entry --> Return to Login Page
      res.render("home", { title: "SUCCESSFUL DATA ENTRY" });
      console.log("SUCCESSFUL DATA ENTRY\n")
      console.log("--------------------------------------------\n");

    });
  }
});

// ----------------- AUTH TOKEN TESTING -----------------
app.post('https://api.aqmeshdata.net/api.Authenticate', function(req, res) {
  res.render(auth_url, {
  "username":"Fake Name", //changed auth details since project end for security
  "password":"FakePassword12345" //changed auth details since project end for security
  });
});
// ----------------- AUTH TOKEN TESTING -----------------

app.post('/tryLogin', function (req, res) {

  // Acquire values from HTML form input
  const sessionID = req.session.id;
  const accountID = req.body.accountID;
  const licenseKey = req.body.licenseKey;

  // accountID OR licenseKey not entered by user
  if (accountID == null || licenseKey == null) {
    res.render("test", { title: "Error: Empty Input" });
  }

  // Successful User Login Attempt
  else {

    // --------------------- BEGINNING FORMAT ---------------------
    console.log("BEGINNING QUERY\n");
    console.log("--------------------------------------------\n");
    // --------------------- BEGINNING FORMAT ---------------------

    // Build SQL Query with user information
    var customerData = "SELECT * FROM customerData WHERE username='" + accountID + "'"
                       + "AND password='" + licenseKey + "'";

    // Send Query to MySQL (SELECT)
    connection_pool.query(customerData, function (err, result) {

      // Unsuccessful Data Retrieval --> Redirect to 404 Page
      if (err) {
        throw err;
        res.redirect(404, { title: "INCORRECT INFO" });
      }

      // Successul Data Retrieval --> Render Results on Test Page
      res.render("test", {
        title: "SUCCESSFUL DATA RETRIEVAL",
        sessionID: result[0].sessionID,
        companyName: result[0].companyName,
        username: result[0].username,
        password: result[0].password
      });

      // --------------------- ENDING FORMAT ---------------------
      console.log(result);
      console.log("\n" + "--------------------------------------------\n");
      // --------------------- ENDING FORMAT ---------------------
    });
  }
});

// Homepage Edge Case
app.get('/index', function (req, res) {
  res.redirect('/');
});

// Redirect Incorrect URLs to 404 Page
app.get("/*", function(req, res) {
  res.render("404");
});

// ------------------------ END OF ROUTES ------------------------


// Listen on designated port number
app.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT + "\n\n" + "Press Ctrl+C to quit..\n\n")
});
