const express = require("express");
const path = require("path");

///////////////////////////////////
const app = express();
const port = process.env.PORT || 3000;

/////////////////////////////////// set VIEWS and VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/////////////////////////////////// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/////////////////////////////////// ROUTES
app.route("/").get((req, res) => {
  res.render("index");
});

///////////////////////////////////  LISTEN TO PORT
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
