// Enable express and express-handlebars in project
const express = require("express");
const exphbs = require("express-handlebars");

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

app.use(express.static(PATH.join(__dirname, "/assets")))

// Route rendering
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/*", (req,res) => {
  res.render("404");
});

// Listen on designated port number
app.listen(PORT, () => {
  console.log("Listening on localhost:" + PORT + "\n\n" + "Press Ctrl+C to quit..")
});

/*
const router = express.Router();

const PORT = process.env.PORT || 1337;

const assetsDir = __dirname + "/public/"
const indexDir = __dirname + "/public/html/";
const styleDir = __dirname + "/public/css/";

router.get('/', function(request, response) {
  response.sendFile(PATH.join(indexDir + "index.html"));
});

app.use('/', router);
app.use(express.static(__dirname + 'public'));
app.listen(PORT);

console.log("Listening on localhost:" + PORT + "\n\n" + "Press Ctrl+C to quit..");
*/
